import { sanityUpsertPost } from "@/lib/automation/sanity";
import { createSupabaseAdminClient } from "@/lib/automation/supabase-admin";
import { validateCommercialReview, validatePublishedPostBasics } from "@/lib/contentQuality";
import { ensureTopicClusterLink, pickTopicCluster } from "@/lib/topicClusters";

type Provider = "openai" | "anthropic";

function envOptional(name: string) {
  const value = process.env[name];
  return value && value.length ? value : undefined;
}

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return JSON");
  }
  return text.slice(start, end + 1);
}

async function callOpenAI(prompt: string) {
  const apiKey = env("OPENAI_API_KEY");
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a precise JSON generator." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as unknown;
  let content: unknown = null;
  if (data && typeof data === "object") {
    const choices = (data as { choices?: unknown }).choices;
    if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
      const message = (choices[0] as { message?: unknown }).message;
      if (message && typeof message === "object") {
        content = (message as { content?: unknown }).content;
      }
    }
  }
  if (typeof content !== "string") throw new Error("OpenAI response missing content");
  return content;
}

async function callAnthropic(prompt: string) {
  const apiKey = env("ANTHROPIC_API_KEY");
  const model = process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 3000,
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as unknown;
  const blocks =
    typeof data === "object" && data ? ((data as { content?: unknown }).content as unknown) : undefined;
  const text = Array.isArray(blocks)
    ? blocks
        .map((b) => {
          if (!b || typeof b !== "object") return "";
          const type = (b as { type?: unknown }).type;
          const t = (b as { text?: unknown }).text;
          return type === "text" && typeof t === "string" ? t : "";
        })
        .join("\n")
    : "";
  if (!text) throw new Error("Anthropic response missing text");
  return text;
}

function buildRefreshPrompt(input: {
  title: string;
  slug: string;
  existingMarkdown: string;
  publishedAtISO: string;
  updatedAtISO: string;
}) {
  return [
    "You are updating an existing Boomkas blog post for freshness.",
    "Return ONLY valid JSON. No markdown fences. No commentary.",
    "",
    `Title: ${input.title}`,
    `Slug: ${input.slug}`,
    `Published at (ISO): ${input.publishedAtISO}`,
    `Currently updated at (ISO): ${input.updatedAtISO}`,
    "",
    "Update rules:",
    "- Keep the post helpful, specific, and accurate. Do not invent pricing.",
    "- Update any pricing sections by marking them as \"Pricing needs verification\" if not confirmed.",
    "- Add or update these lines near the top (ISO date):",
    "  - Tested By: Boomkas Team (Hands-on testing across real workflows)",
    "  - Last Tested: YYYY-MM-DD",
    "  - Updated: YYYY-MM-DD",
    "- Preserve internal links and affiliate CTAs if present.",
    "- Keep paragraphs short and headings scannable.",
    "- Ensure these H2 sections exist (add them if missing):",
    "  - Our Testing Process",
    "  - What We Found",
    "  - Unique Insight",
    "  - Comparison",
    "  - FAQ",
    "",
    "Existing markdown:",
    input.existingMarkdown.slice(0, 14000),
    "",
    "Output JSON shape:",
    "{",
    '  \"excerpt\": \"...\",',
    '  \"metaDescription\": \"...\",',
    '  \"contentMarkdown\": \"...\"',
    "}",
  ].join("\n");
}

function safeParseRefresh(jsonText: string) {
  const parsed = JSON.parse(jsonText) as Record<string, unknown>;
  const excerpt = typeof parsed.excerpt === "string" ? parsed.excerpt.trim() : "";
  const metaDescription = typeof parsed.metaDescription === "string" ? parsed.metaDescription.trim() : "";
  const contentMarkdown = typeof parsed.contentMarkdown === "string" ? parsed.contentMarkdown.trim() : "";
  if (!excerpt || !metaDescription || !contentMarkdown) throw new Error("Refresh JSON missing required fields");
  return { excerpt, metaDescription, contentMarkdown };
}

export async function refreshOneOldPost() {
  const serviceRole = envOptional("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRole) return { status: "skipped_no_supabase" as const };

  const sb = createSupabaseAdminClient();
  const { data } = await sb
    .from("posts")
    .select("slug,title,excerpt,content,published_at,updated_at,status,category")
    .eq("status", "published")
    .order("updated_at", { ascending: true })
    .limit(200);

  const rows = (data as Array<Record<string, unknown>> | null) ?? [];
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const target = rows.find((r) => {
    const updated = typeof r.updated_at === "string" ? Date.parse(r.updated_at) : NaN;
    return Number.isFinite(updated) && now - updated > ninetyDaysMs;
  });

  if (!target) return { status: "no_old_posts" as const };

  const slug = typeof target.slug === "string" ? target.slug : "";
  const title = typeof target.title === "string" ? target.title : "";
  const content = typeof target.content === "string" ? target.content : "";
  const publishedAtISO = typeof target.published_at === "string" ? target.published_at : new Date().toISOString();
  const updatedAtISO = typeof target.updated_at === "string" ? target.updated_at : publishedAtISO;
  const category = typeof target.category === "string" ? target.category : "Tool Comparisons";
  if (!slug || !title || !content) return { status: "invalid_row" as const };

  const prompt = buildRefreshPrompt({ title, slug, existingMarkdown: content, publishedAtISO, updatedAtISO });
  const provider = (process.env.LLM_PROVIDER as Provider | undefined) ?? "openai";
  const raw = provider === "anthropic" ? await callAnthropic(prompt) : await callOpenAI(prompt);
  const jsonText = provider === "openai" ? raw : extractJson(raw);
  const refreshed = safeParseRefresh(jsonText);

  const cluster = pickTopicCluster({ keyword: title, title, markdown: refreshed.contentMarkdown });
  const contentMarkdown = ensureTopicClusterLink(refreshed.contentMarkdown, cluster);

  const quality = validatePublishedPostBasics(contentMarkdown);
  validateCommercialReview(contentMarkdown);
  if (quality.score < 70) {
    throw new Error(`Refreshed content quality too low (${quality.score}/100) for ${slug}`);
  }

  await sanityUpsertPost({
    slug,
    title,
    excerpt: refreshed.excerpt,
    metaDescription: refreshed.metaDescription,
    category,
    contentMarkdown,
    publishedAtISO,
    keyword: title,
    intent: "Commercial",
    qualityScore: quality.score,
    qualityWordCount: quality.wordCount,
    internalLinks: [],
    affiliateToolSlugs: [],
    hasAffiliate: quality.hasAffiliate,
    testedBy: quality.extracted.testedBy,
    lastTestedISO: quality.extracted.lastTestedISO,
    updatedISO: quality.extracted.updatedISO,
    topicCluster: cluster.slug,
    pillarPath: cluster.pillarPath,
  });

  await sb
    .from("posts")
    .upsert(
      {
        slug,
        title,
        excerpt: refreshed.excerpt,
        metaTitle: title,
        description: refreshed.metaDescription,
        category,
        content: contentMarkdown,
        status: "published",
        published_at: publishedAtISO,
      },
      { onConflict: "slug" }
    );

  return { status: "refreshed" as const, slug };
}
