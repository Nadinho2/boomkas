import { revalidatePath } from "next/cache";

import { fetchKeywordsFromCsvUrl } from "@/lib/automation/keywords";
import { generatePostWithLLM } from "@/lib/automation/llm";
import { slugifyKeyword } from "@/lib/automation/slugs";
import { sanityFetchExistingBlogSlugs, sanityUpsertPost } from "@/lib/automation/sanity";
import { createSupabaseAdminClient } from "@/lib/automation/supabase-admin";

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

  const publishedAtISO = new Date().toISOString();

  await sanityUpsertPost({
    slug: generated.slug,
    title: generated.title,
    excerpt: generated.excerpt,
    metaDescription: generated.metaDescription,
    category: generated.category,
    contentMarkdown: generated.contentMarkdown,
    publishedAtISO,
    keyword: generated.keyword,
  });

  if (envOptional("SUPABASE_SERVICE_ROLE_KEY")) {
    await upsertSupabasePost({
      slug: generated.slug,
      title: generated.title,
      excerpt: generated.excerpt,
      metaTitle: generated.title,
      description: generated.metaDescription,
      category: generated.category,
      content: generated.contentMarkdown,
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
