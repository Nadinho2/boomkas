import { slugifyKeyword } from "@/lib/automation/slugs";

export type GeneratedPost = {
  keyword: string;
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  category:
    | "Coding Agents"
    | "Workflow Automation"
    | "Multi-Agent Systems"
    | "Beginner Guides"
    | "Tool Comparisons"
    | "Productivity Tips";
  intent: "Informational" | "Commercial" | "Navigational";
  contentMarkdown: string;
  affiliateToolSlugs: string[];
  internalLinks: Array<{ label: string; href: string }>;
};

type Provider = "openai" | "anthropic";

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

function safeParseGeneratedPost(keyword: string, jsonText: string): GeneratedPost {
  const parsed = JSON.parse(jsonText) as Partial<GeneratedPost> & Record<string, unknown>;
  const slug = typeof parsed.slug === "string" && parsed.slug.length ? parsed.slug : slugifyKeyword(keyword);
  const title = typeof parsed.title === "string" ? parsed.title.trim() : "";
  const metaDescription = typeof parsed.metaDescription === "string" ? parsed.metaDescription.trim() : "";
  const excerpt = typeof parsed.excerpt === "string" ? parsed.excerpt.trim() : "";
  const contentMarkdown = typeof parsed.contentMarkdown === "string" ? parsed.contentMarkdown.trim() : "";
  const affiliateToolSlugs = Array.isArray(parsed.affiliateToolSlugs)
    ? parsed.affiliateToolSlugs.filter((s): s is string => typeof s === "string" && s.length > 0).slice(0, 5)
    : [];
  const internalLinks = Array.isArray(parsed.internalLinks)
    ? parsed.internalLinks
        .filter((x): x is { label: string; href: string } => {
          if (!x || typeof x !== "object") return false;
          const label = (x as { label?: unknown }).label;
          const href = (x as { href?: unknown }).href;
          return typeof label === "string" && typeof href === "string";
        })
        .slice(0, 6)
    : [];

  const category =
    parsed.category === "Coding Agents" ||
    parsed.category === "Workflow Automation" ||
    parsed.category === "Multi-Agent Systems" ||
    parsed.category === "Beginner Guides" ||
    parsed.category === "Tool Comparisons" ||
    parsed.category === "Productivity Tips"
      ? parsed.category
      : "Tool Comparisons";

  const intent =
    parsed.intent === "Informational" || parsed.intent === "Commercial" || parsed.intent === "Navigational"
      ? parsed.intent
      : "Commercial";

  if (!title || !metaDescription || !excerpt || !contentMarkdown) {
    throw new Error("Generated JSON missing required fields");
  }

  return {
    keyword,
    slug,
    title,
    metaDescription,
    excerpt,
    category,
    intent,
    contentMarkdown,
    affiliateToolSlugs,
    internalLinks,
  };
}

function buildPrompt(input: {
  keyword: string;
  siteUrl: string;
  knownToolSlugs: string[];
  knownBlogSlugs: string[];
}) {
  const toolSlugs = input.knownToolSlugs.slice(0, 50).join(", ");
  const blogSlugs = input.knownBlogSlugs.slice(0, 50).join(", ");

  return [
    "You are writing for Boomkas (boomkas.com), an AI tools review + affiliate blog.",
    "Write a Helpful Content System optimized post targeting the given keyword in the agentic AI tools niche.",
    "Return ONLY valid JSON. No markdown fences. No commentary.",
    "",
    "Keyword:",
    input.keyword,
    "",
    "Title rules:",
    "- Unique title, primary keyword near the start, include current year.",
    "- Target 50–60 characters.",
    '- Format: \"[Primary Keyword] Review (2026): [Unique Value Proposition]\" when commercial intent.',
    "",
    "Internal links requirement:",
    "- Provide 5–8 internalLinks objects with {label, href}.",
    `- href must be relative and start with /blog/, /tools/, /categories/, /use-cases/, /guides/, or /compare/. Site base is ${input.siteUrl}.`,
    `- Use existing slugs where possible. Known tool slugs: ${toolSlugs || "(none)"}. Known blog slugs: ${blogSlugs || "(none)"}.`,
    "- Include at least one internal link to a relevant topic hub under /categories/ (AI Writing Tools, AI Image Tools, AI Coding Tools, AI Productivity Tools, or AI Marketing Tools).",
    "",
    "Affiliate CTA requirement:",
    "- Choose 1–3 affiliateToolSlugs that match the topic (from known tool slugs where possible).",
    "- In the post body, include at least 2 affiliate CTAs using the /go/<toolSlug> pattern as plain markdown links.",
    "",
    "First-hand experience requirements:",
    "- Include a dedicated H2 section titled exactly: Our Testing Process.",
    "- Include a dedicated H2 section titled exactly: What We Found (with specific observations).",
    "- Include a dedicated H2 section titled exactly: Unique Insight (one insight/stat/workflow not commonly found elsewhere).",
    "- Near the top, include these exact lines:",
    "  - Tested By: Boomkas Team (Hands-on testing across real workflows)",
    "  - Last Tested: YYYY-MM-DD",
    "  - Updated: YYYY-MM-DD",
    "- Include at least one unique insight not commonly found elsewhere (a statistic, workflow trick, or perspective).",
    "",
    "Content rules:",
    "- Minimum 1,500 words.",
    "- Use markdown with H2/H3 headings, bullet lists, and at least one comparison table when relevant.",
    "- Keep paragraphs to 1–3 sentences. Use clear, scannable headings.",
    "- Avoid medical/legal claims.",
    "- Do NOT invent pricing. If you cannot confirm a price, write \"Pricing needs verification\" and include the official pricing URL as a citation.",
    "- Include citations with outbound links for any statistics or pricing claims.",
    "",
    "Required review sections for commercial intent:",
    "- TL;DR (bulleted summary at top).",
    "- Pricing Breakdown (include exact numbers ONLY if confirmed; otherwise mark as needs verification).",
    "- Pros (at least 5) and Cons (at least 5).",
    "- Who it is best for.",
    "- Who should avoid it.",
    "- Real use case examples.",
    "- Comparison to at least one competitor (H2: Comparison).",
    "- Final Verdict with a star rating (1–5) (H2: Final Verdict).",
    "- FAQ section with at least 5 questions (H2: FAQ).",
    "",
    "Output JSON shape:",
    "{",
    '  \"slug\": \"...\",',
    '  \"title\": \"...\",',
    '  \"metaDescription\": \"...\",',
    '  \"excerpt\": \"...\",',
    '  \"category\": \"Tool Comparisons\" | \"Coding Agents\" | \"Workflow Automation\" | \"Multi-Agent Systems\" | \"Beginner Guides\" | \"Productivity Tips\",',
    '  \"intent\": \"Informational\" | \"Commercial\" | \"Navigational\",',
    '  \"contentMarkdown\": \"...\",',
    '  \"affiliateToolSlugs\": [\"...\"],',
    '  \"internalLinks\": [{\"label\":\"...\",\"href\":\"/tools/...\"}]',
    "}",
  ].join("\n");
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
      temperature: 0.6,
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
      max_tokens: 4000,
      temperature: 0.6,
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

export async function generatePostWithLLM(input: {
  keyword: string;
  siteUrl?: string;
  provider?: Provider;
  knownToolSlugs: string[];
  knownBlogSlugs: string[];
}): Promise<GeneratedPost> {
  const prompt = buildPrompt({
    keyword: input.keyword,
    siteUrl: input.siteUrl ?? "https://boomkas.com",
    knownToolSlugs: input.knownToolSlugs,
    knownBlogSlugs: input.knownBlogSlugs,
  });

  const provider = input.provider ?? ((process.env.LLM_PROVIDER as Provider | undefined) ?? "openai");
  const raw = provider === "anthropic" ? await callAnthropic(prompt) : await callOpenAI(prompt);
  const jsonText = provider === "openai" ? raw : extractJson(raw);
  return safeParseGeneratedPost(input.keyword, jsonText);
}
