export type BlogCategory =
  | "Coding Agents"
  | "Workflow Automation"
  | "Multi-Agent Systems"
  | "Beginner Guides"
  | "Tool Comparisons"
  | "Productivity Tips";

export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: number;
  category: BlogCategory;
  featuredImage: string;
  tags: string[];
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Coding Agents",
  "Workflow Automation",
  "Multi-Agent Systems",
  "Beginner Guides",
  "Tool Comparisons",
  "Productivity Tips",
];

export const BLOG_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'%3E%3Cdefs%3E%3CradialGradient id='a' cx='20%25' cy='10%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='rgba(0,240,255,0.35)'/%3E%3Cstop offset='60%25' stop-color='rgba(0,0,0,0)'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='90%25' cy='70%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='rgba(255,107,0,0.28)'/%3E%3Cstop offset='60%25' stop-color='rgba(0,0,0,0)'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='rgb(6,10,20)'/%3E%3Crect width='1600' height='900' fill='url(%23a)'/%3E%3Crect width='1600' height='900' fill='url(%23b)'/%3E%3C/svg%3E";

export const BLOG_POSTS: BlogPostSummary[] = [
  {
    slug: "best-agentic-ai-tools-2026",
    title: "Best Agentic AI Tools in 2026: The Shortlist (and How to Pick)",
    excerpt:
      "A practical, updated shortlist of agentic tools across coding, workflow automation, and multi-agent systems—plus a simple selection framework.",
    date: "2026-04-15",
    readingTime: 12,
    category: "Tool Comparisons",
    featuredImage: BLOG_IMAGE_PLACEHOLDER,
    tags: ["best tools", "comparison", "2026", "agents"],
  },
];

export const BLOG_POSTS_BY_SLUG: Record<string, BlogPostSummary> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p])
);

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS_BY_SLUG[slug];
}
