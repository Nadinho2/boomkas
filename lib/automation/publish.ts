import { revalidatePath } from "next/cache";

import { fetchKeywordsFromCsvUrl } from "@/lib/automation/keywords";
import { generatePostWithLLM } from "@/lib/automation/llm";
import { slugifyKeyword } from "@/lib/automation/slugs";
import { sanityFetchExistingBlogSlugs, sanityUpsertPost } from "@/lib/automation/sanity";
import { createSupabaseAdminClient } from "@/lib/automation/supabase-admin";
import { validateCommercialReview, validatePublishedPostBasics } from "@/lib/contentQuality";
import { ensureTopicClusterLink, pickTopicCluster } from "@/lib/topicClusters";

function envOptional(name: string) {
  const value = process.env[name];
  return value && value.length ? value : undefined;
}

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

async function getExistingSupabasePostSlugs(limit = 500): Promise<string[]> {
  const serviceRole = envOptional("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRole) return [];
  const sb = createSupabaseAdminClient();
  const { data } = await sb.from("posts").select("slug").limit(limit);
  return (data ?? [])
    .map((r: unknown) => {
      if (!r || typeof r !== "object") return "";
      const slug = (r as { slug?: unknown }).slug;
      return typeof slug === "string" ? slug : "";
    })
    .filter((s) => s.length > 0);
}

async function getExistingSupabasePosts(limit = 200): Promise<Array<{ slug: string; content: string }>> {
  const serviceRole = envOptional("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRole) return [];
  try {
    const sb = createSupabaseAdminClient();
    const { data } = await sb
      .from("posts")
      .select("slug,content,status")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    const rows = (data as Array<Record<string, unknown>> | null) ?? [];
    return rows
      .map((r) => {
        const slug = typeof r.slug === "string" ? r.slug : "";
        const content = typeof r.content === "string" ? r.content : "";
        if (!slug || !content) return null;
        return { slug, content };
      })
      .filter((x): x is { slug: string; content: string } => !!x);
  } catch {
    return [];
  }
}

function shingleSet(text: string, n = 6) {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const set = new Set<string>();
  for (let i = 0; i + n <= tokens.length; i++) {
    set.add(tokens.slice(i, i + n).join(" "));
  }
  return set;
}

function jaccard(a: Set<string>, b: Set<string>) {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union > 0 ? inter / union : 0;
}

async function getKnownToolSlugs(limit = 200): Promise<string[]> {
  const serviceRole = envOptional("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRole) return [];
  const sb = createSupabaseAdminClient();
  const { data } = await sb.from("tools").select("slug").limit(limit);
  return (data ?? [])
    .map((r: unknown) => {
      if (!r || typeof r !== "object") return "";
      const slug = (r as { slug?: unknown }).slug;
      return typeof slug === "string" ? slug : "";
    })
    .filter((s) => s.length > 0);
}

async function upsertSupabasePost(input: {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle?: string;
  description?: string;
  category: string;
  content: string;
  status: "published" | "draft";
  published_at: string;
}) {
  const sb = createSupabaseAdminClient();
  const payload = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    metaTitle: input.metaTitle ?? null,
    description: input.description ?? input.excerpt,
    category: input.category,
    content: input.content,
    status: input.status,
    published_at: input.published_at,
  };

  const { error } = await sb.from("posts").upsert(payload, { onConflict: "slug" });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

async function triggerN8nWebhook(input: { title: string; url: string; slug: string }) {
  const webhookUrl = envOptional("N8N_PUBLISH_WEBHOOK_URL");
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function runOneKeywordPipeline() {
  const csvUrl = env("KEYWORDS_CSV_URL");
  const keywords = await fetchKeywordsFromCsvUrl(csvUrl);
  if (keywords.length === 0) return { status: "no_keywords" as const };

  const [sanitySlugs, supabaseSlugs, toolSlugs] = await Promise.all([
    sanityFetchExistingBlogSlugs().catch(() => [] as string[]),
    getExistingSupabasePostSlugs(),
    getKnownToolSlugs(),
  ]);

  const existing = new Set<string>([...sanitySlugs, ...supabaseSlugs].map((s) => s.toLowerCase()));

  const next = keywords.find((k) => {
    const slug = slugifyKeyword(k.keyword);
    return !existing.has(slug.toLowerCase());
  });

  if (!next) return { status: "all_done" as const };

  const knownBlogSlugs = Array.from(existing).slice(0, 200);
  const generated = await generatePostWithLLM({
    keyword: next.keyword,
    knownToolSlugs: toolSlugs,
    knownBlogSlugs,
  });

  const cluster = pickTopicCluster({
    keyword: generated.keyword,
    title: generated.title,
    markdown: generated.contentMarkdown,
  });
  const contentMarkdown = ensureTopicClusterLink(generated.contentMarkdown, cluster);

  const quality = validatePublishedPostBasics(contentMarkdown);
  if (generated.intent === "Commercial") validateCommercialReview(contentMarkdown);
  if (quality.score < 70) {
    throw new Error(
      `Content quality score too low (${quality.score}/100). wordCount=${quality.wordCount}. Refusing to publish.`
    );
  }

  const existingPosts = await getExistingSupabasePosts(120);
  if (existingPosts.length) {
    const candidate = shingleSet(contentMarkdown);
    for (const p of existingPosts) {
      const sim = jaccard(candidate, shingleSet(p.content));
      if (sim >= 0.35) {
        throw new Error(`Originality check failed (similarity ${sim.toFixed(2)}) vs ${p.slug}`);
      }
    }
  }

  const publishedAtISO = new Date().toISOString();

  await sanityUpsertPost({
    slug: generated.slug,
    title: generated.title,
    excerpt: generated.excerpt,
    metaDescription: generated.metaDescription,
    category: generated.category,
    contentMarkdown,
    publishedAtISO,
    keyword: generated.keyword,
    intent: generated.intent,
    qualityScore: quality.score,
    qualityWordCount: quality.wordCount,
    internalLinks: generated.internalLinks,
    affiliateToolSlugs: generated.affiliateToolSlugs,
    hasAffiliate: quality.hasAffiliate,
    testedBy: quality.extracted.testedBy,
    lastTestedISO: quality.extracted.lastTestedISO,
    updatedISO: quality.extracted.updatedISO,
    topicCluster: cluster.slug,
    pillarPath: cluster.pillarPath,
  });

  if (envOptional("SUPABASE_SERVICE_ROLE_KEY")) {
    await upsertSupabasePost({
      slug: generated.slug,
      title: generated.title,
      excerpt: generated.excerpt,
      metaTitle: generated.title,
      description: generated.metaDescription,
      category: generated.category,
      content: contentMarkdown,
      status: "published",
      published_at: publishedAtISO,
    });
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${generated.slug}`);
  revalidatePath("/sitemap.xml");

  const postUrl = `https://boomkas.com/blog/${generated.slug}`;
  await triggerN8nWebhook({ title: generated.title, url: postUrl, slug: generated.slug });

  return { status: "published" as const, slug: generated.slug, title: generated.title, url: postUrl };
}
