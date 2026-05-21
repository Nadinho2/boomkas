import { NextResponse } from "next/server";

import { plainStringToPortableText } from "@/lib/portableText";
import { sanityEnsureAuthor, sanityMutate } from "@/lib/sanity";

type PublishFaqItem = { question: string; answer: string };

type PublishPayload = {
  title: string;
  slug?: string;
  metaDescription: string;
  featuredImageAlt?: string;
  tldr?: string;
  starRating?: number;
  body: string;
  faq?: PublishFaqItem[];
  affiliateDisclosure?: string;
  lastTested?: string;
  primaryKeyword?: string;
  category?: string;
};

const RATE_LIMIT = { max: 10, windowMs: 60_000 };

declare global {
  var __boomkasPublishRateLimit: Map<string, { count: number; resetAt: number }> | undefined;
}

function rateLimitStore() {
  if (!globalThis.__boomkasPublishRateLimit) globalThis.__boomkasPublishRateLimit = new Map();
  return globalThis.__boomkasPublishRateLimit;
}

function getClientIp(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const xrip = request.headers.get("x-real-ip");
  return xrip?.trim() || "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const store = rateLimitStore();
  const existing = store.get(ip);
  if (!existing || now >= existing.resetAt) {
    store.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { ok: true as const, remaining: RATE_LIMIT.max - 1, resetAt: now + RATE_LIMIT.windowMs };
  }
  if (existing.count >= RATE_LIMIT.max) {
    return { ok: false as const, remaining: 0, resetAt: existing.resetAt };
  }
  existing.count += 1;
  store.set(ip, existing);
  return { ok: true as const, remaining: RATE_LIMIT.max - existing.count, resetAt: existing.resetAt };
}

function slugify(input: string) {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `post-${Date.now().toString(36)}`;
}

function clamp(input: string, max: number) {
  const s = input.trim();
  return s.length > max ? s.slice(0, max) : s;
}

function badRequest(message: string, details?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, details }, { status: 400 });
}

async function pingSitemaps() {
  const sitemap = encodeURIComponent("https://boomkas.com/sitemap.xml");
  const urls = [
    `https://www.google.com/ping?sitemap=${sitemap}`,
    `https://www.bing.com/ping?sitemap=${sitemap}`,
  ];
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { method: "GET" });
        return { url, status: res.status };
      } catch {
        return { url, status: 0 };
      }
    })
  );
  for (const r of results) console.info(`[publish] sitemap ping ${r.status} ${r.url}`);
  return results;
}

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  const expected = process.env.PUBLISH_API_KEY;
  if (!expected || expected.length < 16) {
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
  }
  if (!apiKey || apiKey !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  let payload: PublishPayload;
  try {
    payload = (await request.json()) as PublishPayload;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const metaDescription = typeof payload.metaDescription === "string" ? payload.metaDescription.trim() : "";
  const bodyText = typeof payload.body === "string" ? payload.body.trim() : "";
  const category = typeof payload.category === "string" ? payload.category.trim() : "";
  const primaryKeyword = typeof payload.primaryKeyword === "string" ? payload.primaryKeyword.trim() : "";

  if (!title) return badRequest("Missing required field: title");
  if (!metaDescription) return badRequest("Missing required field: metaDescription");
  if (!bodyText) return badRequest("Missing required field: body");
  if (metaDescription.length > 160) return badRequest("metaDescription must be 160 characters or fewer");
  if (!category) return badRequest("Missing required field: category");
  if (!primaryKeyword) return badRequest("Missing required field: primaryKeyword");

  const slug = slugify(typeof payload.slug === "string" && payload.slug.trim() ? payload.slug : title);
  const featuredImageAlt =
    typeof payload.featuredImageAlt === "string" ? clamp(payload.featuredImageAlt, 180) : undefined;
  const tldr = typeof payload.tldr === "string" ? payload.tldr.trim() : undefined;
  const starRating = typeof payload.starRating === "number" ? payload.starRating : undefined;
  if (typeof starRating === "number" && (starRating < 0 || starRating > 5)) {
    return badRequest("starRating must be between 0 and 5");
  }

  const faqInput = Array.isArray(payload.faq) ? payload.faq : [];
  const faq = faqInput
    .filter((x) => x && typeof x === "object")
    .map((x) => ({
      question: typeof (x as PublishFaqItem).question === "string" ? (x as PublishFaqItem).question.trim() : "",
      answer: typeof (x as PublishFaqItem).answer === "string" ? (x as PublishFaqItem).answer.trim() : "",
    }))
    .filter((x) => x.question.length > 0 && x.answer.length > 0)
    .slice(0, 20);

  const affiliateDisclosure =
    typeof payload.affiliateDisclosure === "string" ? payload.affiliateDisclosure.trim() : undefined;
  const lastTested = typeof payload.lastTested === "string" ? payload.lastTested.trim() : undefined;

  const publishedAt = new Date().toISOString();
  const seoTitle = clamp(title, 60);

  console.info(`[publish] ${new Date().toISOString()} ip=${ip} title="${title}"`);

  try {
    const bodyPortable = plainStringToPortableText(bodyText);

    const defaultAuthorId = await sanityEnsureAuthor({
      slug: "boomkas-team",
      name: "Boomkas Team",
      bio: "We test AI tools hands-on across real workflows and publish practical, verifiable takeaways.",
      credentials: "Hands-on AI tool testing • Automation workflows • Agentic systems",
    });
    const docId = `post.${slug}`;

    const mutations = [
      {
        createOrReplace: {
          _id: docId,
          _type: "post",
          title,
          slug: { _type: "slug", current: slug },
          seoTitle,
          metaDescription,
          featuredImageAlt,
          tldr,
          starRating,
          faq: faq.map((f) => ({ _type: "faqItem", _key: `${Math.random().toString(36).slice(2, 10)}`, ...f })),
          affiliateDisclosure,
          lastTested,
          primaryKeyword,
          category,
          publishedAt,
          author: defaultAuthorId ? { _type: "reference", _ref: defaultAuthorId } : undefined,
          isAutoPublished: true,
          body: bodyPortable,
        },
      },
    ];

    await sanityMutate(mutations);
    const pingResults = await pingSitemaps();

    return NextResponse.json({
      ok: true,
      slug,
      url: `https://boomkas.com/blog/${slug}`,
      publishedAt,
      pings: pingResults,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[publish] error title="${title}" slug="${slug}" ${message}`);
    return NextResponse.json({ ok: false, error: "Publish failed" }, { status: 500 });
  }
}
