export type TopicClusterSlug =
  | "ai-writing-tools"
  | "ai-image-tools"
  | "ai-coding-tools"
  | "ai-productivity-tools"
  | "ai-marketing-tools";

export type TopicCluster = {
  slug: TopicClusterSlug;
  name: string;
  pillarPath: `/categories/${TopicClusterSlug}`;
};

export const TOPIC_CLUSTERS: TopicCluster[] = [
  { slug: "ai-writing-tools", name: "AI Writing Tools", pillarPath: "/categories/ai-writing-tools" },
  { slug: "ai-image-tools", name: "AI Image Tools", pillarPath: "/categories/ai-image-tools" },
  { slug: "ai-coding-tools", name: "AI Coding Tools", pillarPath: "/categories/ai-coding-tools" },
  { slug: "ai-productivity-tools", name: "AI Productivity Tools", pillarPath: "/categories/ai-productivity-tools" },
  { slug: "ai-marketing-tools", name: "AI Marketing Tools", pillarPath: "/categories/ai-marketing-tools" },
];

function scoreMatch(haystack: string, needles: string[]) {
  let score = 0;
  for (const n of needles) if (haystack.includes(n)) score += 1;
  return score;
}

export function pickTopicCluster(input: { keyword: string; title: string; markdown: string }): TopicCluster {
  const hay = `${input.keyword} ${input.title} ${input.markdown.slice(0, 2500)}`.toLowerCase();

  const writing = scoreMatch(hay, ["writing", "copy", "copywriting", "blog", "seo writing", "content writing"]);
  const image = scoreMatch(hay, ["image", "images", "art", "design", "midjourney", "stable diffusion"]);
  const coding = scoreMatch(hay, ["code", "coding", "developer", "programming", "ide", "copilot", "cursor"]);
  const marketing = scoreMatch(hay, ["marketing", "ads", "landing page", "email marketing", "growth", "crm"]);

  const max = Math.max(writing, image, coding, marketing);
  if (max === writing && writing > 0) return TOPIC_CLUSTERS[0];
  if (max === image && image > 0) return TOPIC_CLUSTERS[1];
  if (max === coding && coding > 0) return TOPIC_CLUSTERS[2];
  if (max === marketing && marketing > 0) return TOPIC_CLUSTERS[4];
  return TOPIC_CLUSTERS[3];
}

export function ensureTopicClusterLink(markdown: string, cluster: TopicCluster) {
  const link = `[${cluster.name}](${cluster.pillarPath})`;
  if (markdown.includes(cluster.pillarPath)) return markdown;

  const lines = markdown.split(/\r?\n/);
  const insert = `Category: ${link}`;

  const idx = lines.findIndex((l) => l.trim().startsWith("## "));
  if (idx === -1) return `${insert}\n\n${markdown}`.trim();

  const head = lines.slice(0, idx).join("\n").trim();
  const rest = lines.slice(idx).join("\n").trim();
  return [head, insert, "", rest].filter(Boolean).join("\n").trim();
}

