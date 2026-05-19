import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Agentic AI Blog & Guides 2026 | Boomkas",
  description:
    "In-depth tutorials, tool comparisons, strategies, and insights to master agentic AI in 2026.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Agentic AI Blog & Guides 2026 | Boomkas",
    description:
      "In-depth tutorials, tool comparisons, strategies, and insights to master agentic AI in 2026.",
    url: "https://boomkas.com/blog",
    type: "website",
    images: [{ url: "https://boomkas.com/og.png", alt: "Boomkas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic AI Blog & Guides 2026 | Boomkas",
    description:
      "In-depth tutorials, tool comparisons, strategies, and insights to master agentic AI in 2026.",
    images: ["https://boomkas.com/og.png"],
  },
};

const HIDDEN_POST_SLUGS = new Set(["extra-prevention-tip-recommended"]);

type BlogCategory =
  | "All"
  | "Coding Agents"
  | "Workflow Automation"
  | "Multi-Agent Systems"
  | "Beginner Guides"
  | "Tool Comparisons"
  | "Productivity Tips";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  dateISO: string;
  readingMinutes: number;
  category: Exclude<BlogCategory, "All">;
  featured?: boolean;
  popularityScore: number;
};

const CATEGORIES: BlogCategory[] = [
  "All",
  "Coding Agents",
  "Workflow Automation",
  "Multi-Agent Systems",
  "Beginner Guides",
  "Tool Comparisons",
  "Productivity Tips",
];

const STATIC_POSTS: BlogPost[] = [
  {
    slug: "best-agentic-ai-tools-2026",
    title: "Best Agentic AI Tools 2026: The Ultimate Comparison Guide",
    excerpt:
      "Discover the top 25+ best agentic AI tools in 2026 with pricing, autonomy levels, and real recommendations across coding, workflows, multi-agent systems, and enterprise.",
    dateISO: "2026-04-20",
    readingMinutes: 20,
    category: "Tool Comparisons",
    featured: true,
    popularityScore: 100,
  },
];

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function safeCategory(input: string | null | undefined): Exclude<BlogCategory, "All"> {
  if (
    input === "Coding Agents" ||
    input === "Workflow Automation" ||
    input === "Multi-Agent Systems" ||
    input === "Beginner Guides" ||
    input === "Tool Comparisons" ||
    input === "Productivity Tips"
  ) {
    return input;
  }
  return "Tool Comparisons";
}

function readingMinutesFromText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function formatDate(dateISO: string) {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(
    date
  );
}

function buildQuery(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v.length > 0) sp.set(k, v);
  }
  const qs = sp.toString();
  return qs.length ? `?${qs}` : "";
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: dbPosts } = await supabase
    .from("posts")
    .select("slug,title,excerpt,content,category,status,published_at,updated_at,created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const sp = (await searchParams) ?? {};
  const qRaw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const categoryRaw = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const pageRaw = Array.isArray(sp.page) ? sp.page[0] : sp.page;

  const q = (qRaw ?? "").slice(0, 120);
  const selectedCategory = (categoryRaw ?? "All") as BlogCategory;
  const page = Math.max(1, Number(pageRaw ?? "1") || 1);
  const pageSize = 9;

  const fromDb: BlogPost[] = (dbPosts ?? [])
    .filter((p) => !HIDDEN_POST_SLUGS.has(String(p?.slug ?? "")))
    .filter((p) => typeof p?.slug === "string" && p.slug.length > 0)
    .map((p) => {
      const title = (p.title as string | null) ?? "Untitled";
      const content = (p.content as string | null) ?? "";
      const excerpt =
        ((p.excerpt as string | null) ?? "").trim() ||
        content.trim().slice(0, 180) ||
        "—";
      const dateISO =
        (p.published_at as string | null) ??
        (p.updated_at as string | null) ??
        (p.created_at as string | null) ??
        new Date().toISOString();
      return {
        slug: p.slug as string,
        title,
        excerpt,
        dateISO,
        readingMinutes: readingMinutesFromText([title, excerpt, content].join(" ")),
        category: safeCategory(p.category as string | null),
        popularityScore: 0,
      };
    });

  const postsBySlug = new Map<string, BlogPost>();
  STATIC_POSTS.forEach((p) => {
    if (!HIDDEN_POST_SLUGS.has(p.slug)) postsBySlug.set(p.slug, p);
  });
  fromDb.forEach((p) => {
    if (!postsBySlug.has(p.slug)) postsBySlug.set(p.slug, p);
  });

  const allPosts = Array.from(postsBySlug.values());

  const filtered = allPosts
    .filter((p) => {
    const matchesCategory = selectedCategory === "All" ? true : p.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!q) return true;
    const blob = normalize([p.title, p.excerpt, p.category].join(" "));
    return blob.includes(normalize(q));
  })
    .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));

  const visible = filtered.slice(0, page * pageSize);
  const canLoadMore = visible.length < filtered.length;

  const popular = [...allPosts]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 5);

  const categoryChips = CATEGORIES.map((c) => {
    const isActive = c === selectedCategory;
    const href = `/blog${buildQuery({
      q: q ? q : undefined,
      category: c === "All" ? undefined : c,
    })}`;
    return (
      <Link
        key={c}
        href={href}
        className={[
          "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium tracking-tight",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition",
          isActive
            ? "bg-[color:var(--primary)]/15 text-[color:var(--primary)] shadow-[inset_0_0_0_1px_rgba(0,240,255,0.35)]"
            : "bg-white/5 text-foreground hover:bg-white/8",
        ].join(" ")}
      >
        {c}
      </Link>
    );
  });

  const loadMoreHref = `/blog${buildQuery({
    q: q ? q : undefined,
    category: selectedCategory === "All" ? undefined : selectedCategory,
    page: String(page + 1),
  })}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] px-6 py-10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(0,240,255,0.18),transparent_55%),radial-gradient(60%_60%_at_90%_70%,rgba(255,107,0,0.14),transparent_55%)]"
        />
        <div className="relative">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Agentic AI Blog &amp; Guides
          </h1>
          <p className="mt-3 max-w-3xl text-pretty text-sm text-muted-foreground sm:text-base">
            In-depth tutorials, tool comparisons, strategies, and insights to master agentic AI in 2026
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form action="/blog" method="get" className="w-full max-w-xl">
              <div className="flex gap-2">
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Search posts (tutorials, comparisons, workflows)…"
                  aria-label="Search blog posts"
                />
                {selectedCategory !== "All" ? (
                  <input type="hidden" name="category" value={selectedCategory} />
                ) : null}
                <Button type="submit" variant="secondary" className="shrink-0">
                  Search
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {filtered.length} post{filtered.length === 1 ? "" : "s"} found
                {q ? (
                  <>
                    {" "}
                    for <span className="text-foreground">“{q}”</span>
                  </>
                ) : null}
                {selectedCategory !== "All" ? (
                  <>
                    {" "}
                    in <span className="text-foreground">{selectedCategory}</span>
                  </>
                ) : null}
              </div>
            </form>

            <div className="flex flex-wrap gap-2">{categoryChips}</div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((post) => (
              <Card
                key={post.slug}
                className="group overflow-hidden border-border/60 bg-card/40 transition hover:border-[color:var(--primary)]/30 hover:bg-card/55"
              >
                <div className="relative">
                  <div className="aspect-[16/9] w-full bg-[radial-gradient(60%_60%_at_20%_10%,rgba(0,240,255,0.18),transparent_55%),radial-gradient(60%_60%_at_90%_70%,rgba(255,107,0,0.14),transparent_55%)]" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
                      Featured image
                    </div>
                  </div>
                  {post.featured ? (
                    <div className="absolute left-3 top-3">
                      <Badge variant="cyan">Featured</Badge>
                    </div>
                  ) : null}
                </div>

                <CardHeader className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">{post.category}</Badge>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(post.dateISO)} • {post.readingMinutes} min read
                    </div>
                  </div>
                  <CardTitle className="text-base leading-snug tracking-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="outline-none transition hover:text-[color:var(--primary)]"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{post.excerpt}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-[color:var(--primary)] transition hover:underline"
                    >
                      Read guide
                    </Link>
                    <div className="text-xs text-muted-foreground tabular-nums">2026</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center">
            {canLoadMore ? (
              <Button asChild size="lg" variant="secondary">
                <Link href={loadMoreHref}>Load More</Link>
              </Button>
            ) : (
              <div className="text-sm text-muted-foreground">You’ve reached the end.</div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Popular Posts</CardTitle>
              <CardDescription>High-signal reads people keep coming back to.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {popular.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block rounded-2xl bg-white/[0.03] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] transition hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{p.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {p.category} • {p.readingMinutes} min
                      </div>
                    </div>
                    <div className="shrink-0 text-xs font-semibold text-[color:var(--secondary)]">
                      {p.popularityScore}
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Newsletter</CardTitle>
              <CardDescription>Weekly tactics, tool drops, and agent workflows. No spam.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" action="#" method="post">
                <Input type="email" name="email" placeholder="you@company.com" aria-label="Email address" />
                <Button type="submit" size="lg" className="w-full">
                  Subscribe
                </Button>
                <div className="text-xs text-muted-foreground">
                  By subscribing, you agree to receive emails from Boomkas. Unsubscribe anytime.
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Start Here</CardTitle>
              <CardDescription>New to agentic AI? Use these fast paths.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="secondary" className="w-full">
                <Link href="/tools">Explore Tools</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/">Try Agent Simulator</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="mt-14 rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">SEO note</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Blog posts are served from the Boomkas database. Publish a post in Admin → Posts to have it appear here.
            </div>
          </div>
          <div className="shrink-0">
            <Image
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='64'%3E%3Crect width='280' height='64' fill='rgba(0,0,0,0)'/%3E%3C/svg%3E"
              alt=""
              width={280}
              height={64}
              priority={false}
              className="opacity-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
