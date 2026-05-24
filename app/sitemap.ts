import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { canonicalUrl, normalizePathname } from "@/lib/seo";
import { sanityFetchPublishedPosts } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const isProd = process.env.VERCEL_ENV === "production";

  type Candidate = {
    pathname: string;
    lastModifiedISO: string | undefined;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  };

  const staticRoutes: Candidate[] = [
    { pathname: "/", lastModifiedISO: undefined, changeFrequency: "daily", priority: 1.0 },
    { pathname: "/tools", lastModifiedISO: undefined, changeFrequency: "daily", priority: 0.95 },
    { pathname: "/blog", lastModifiedISO: undefined, changeFrequency: "daily", priority: 0.9 },
    { pathname: "/rankings", lastModifiedISO: undefined, changeFrequency: "daily", priority: 0.85 },
    { pathname: "/compare", lastModifiedISO: undefined, changeFrequency: "weekly", priority: 0.85 },
    { pathname: "/alternatives", lastModifiedISO: undefined, changeFrequency: "weekly", priority: 0.8 },
    { pathname: "/guides", lastModifiedISO: undefined, changeFrequency: "weekly", priority: 0.8 },
    { pathname: "/use-cases", lastModifiedISO: undefined, changeFrequency: "weekly", priority: 0.8 },
    { pathname: "/about", lastModifiedISO: undefined, changeFrequency: "monthly", priority: 0.6 },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  const supabase =
    supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
      : null;

  const toRecord = (row: unknown) => (row && typeof row === "object" ? (row as Record<string, unknown>) : null);

  const getToolCandidates = async (): Promise<Candidate[]> => {
    if (!supabase) return [];
    try {
      const { data } = await supabase.from("tools").select("slug,updated_at").limit(2000);
      return (data ?? [])
        .map(toRecord)
        .filter((r): r is Record<string, unknown> => !!r)
        .flatMap((r) => {
          const slug = typeof r.slug === "string" ? r.slug : "";
          if (!slug) return [];
          const updated = typeof r.updated_at === "string" ? r.updated_at : undefined;
          return [
            {
              pathname: `/tools/${slug}`,
              lastModifiedISO: updated,
              changeFrequency: "weekly",
              priority: 0.85,
            } satisfies Candidate,
          ];
        });
    } catch {
      return [];
    }
  };

  const getBlogCandidates = async (): Promise<Candidate[]> => {
    const candidates: Candidate[] = [];

    try {
      const sanityPosts = await sanityFetchPublishedPosts({ limit: 2000 });
      for (const p of sanityPosts) {
        const last = p.publishedAt ?? p._updatedAt;
        candidates.push({
          pathname: `/blog/${p.slug}`,
          lastModifiedISO: last,
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
    } catch {
      // ignore
    }

    if (supabase) {
      try {
        const { data } = await supabase
          .from("posts")
          .select("slug,status,published_at,updated_at,created_at")
          .eq("status", "published")
          .limit(4000);
        for (const r of (data ?? []).map(toRecord).filter((x): x is Record<string, unknown> => !!x)) {
          const slug = typeof r.slug === "string" ? r.slug : "";
          if (!slug) continue;
          const last =
            (typeof r.updated_at === "string" ? r.updated_at : undefined) ??
            (typeof r.published_at === "string" ? r.published_at : undefined) ??
            (typeof r.created_at === "string" ? r.created_at : undefined);
          candidates.push({
            pathname: `/blog/${slug}`,
            lastModifiedISO: last,
            changeFrequency: "daily",
            priority: 0.8,
          });
        }
      } catch {
        // ignore
      }
    }

    return candidates;
  };

  const [toolCandidates, blogCandidates] = await Promise.all([getToolCandidates(), getBlogCandidates()]);
  const all = [...staticRoutes, ...toolCandidates, ...blogCandidates];

  const unique = new Map<string, Candidate>();
  for (const c of all) {
    const key = normalizePathname(c.pathname);
    if (!unique.has(key)) unique.set(key, { ...c, pathname: key });
  }
  const candidates = Array.from(unique.values());

  async function checkIs200(url: string) {
    if (!isProd) return true;
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "manual" });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  async function filterConcurrent<T>(items: T[], limit: number, predicate: (item: T) => Promise<boolean>) {
    const results: T[] = [];
    let index = 0;
    const workers = Array.from({ length: Math.max(1, limit) }).map(async () => {
      while (index < items.length) {
        const i = index++;
        const item = items[i];
        if (await predicate(item)) results.push(item);
      }
    });
    await Promise.all(workers);
    return results;
  }

  function safeIsoString(dateString: string | undefined) {
    if (!dateString) return new Date().toISOString();
    try {
      const d = new Date(dateString);
      if (Number.isNaN(d.getTime())) return new Date().toISOString();
      return d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  const checked = await filterConcurrent(candidates, 10, async (c) => checkIs200(canonicalUrl(c.pathname)));

  return checked
    .sort((a, b) => (a.pathname < b.pathname ? -1 : 1))
    .map((c) => {
      const url = canonicalUrl(c.pathname);
      const lastModified = new Date(safeIsoString(c.lastModifiedISO));
      return {
        url,
        lastModified,
        changeFrequency: c.changeFrequency,
        priority: c.priority,
        alternates: {
          languages: {
            "en-US": url,
            "en-GB": url,
            "en-CA": url,
            "en-AU": url,
            "en-IN": url,
            "en-SG": url,
          },
        },
      } satisfies MetadataRoute.Sitemap[number];
    });
}
