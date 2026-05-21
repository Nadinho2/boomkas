import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase";

function wc(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasSection(md: string, title: string) {
  return md.toLowerCase().includes(`## ${title}`.toLowerCase());
}

function qualityScoreFromMarkdown(md: string) {
  const scoreParts = [
    wc(md) >= 1500 ? 10 : 0,
    hasSection(md, "our testing process") ? 10 : 0,
    hasSection(md, "what we found") ? 10 : 0,
    hasSection(md, "pricing breakdown") || hasSection(md, "pricing") ? 10 : 0,
    hasSection(md, "pros") ? 10 : 0,
    hasSection(md, "cons") ? 10 : 0,
    hasSection(md, "faq") ? 10 : 0,
    md.includes("/go/") ? 10 : 0,
    md.match(/\]\(\/(blog|tools)\//g)?.length ? 10 : 0,
  ];
  return scoreParts.reduce((a, b) => a + b, 0);
}

export const dynamic = "force-dynamic";

export default async function AdminContentDashboardPage() {
  let posts: Array<Record<string, unknown>> = [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("posts")
      .select("slug,title,excerpt,content,published_at,updated_at,created_at,status,category")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(200);
    posts = (data as Array<Record<string, unknown>> | null) ?? [];
  } catch {
    posts = [];
  }

  const now = new Date().getTime();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  const normalized = posts
    .map((p) => {
      const slug = typeof p.slug === "string" ? p.slug : "";
      if (!slug) return null;
      const title = typeof p.title === "string" ? p.title : "Untitled";
      const updatedISO =
        (typeof p.updated_at === "string" ? p.updated_at : undefined) ??
        (typeof p.published_at === "string" ? p.published_at : undefined) ??
        (typeof p.created_at === "string" ? p.created_at : undefined) ??
        new Date().toISOString();
      const updatedMs = Date.parse(updatedISO);
      const content = typeof p.content === "string" ? p.content : "";
      const score = content ? qualityScoreFromMarkdown(content) : 0;
      const internalLinks = content.match(/\]\(\/(blog|tools)\//g)?.length ?? 0;
      const affiliateClicks = "Tracked in GA4";
      return {
        slug,
        title,
        updatedISO,
        updatedMs,
        score,
        internalLinks,
        hasAffiliate: content.includes("/go/"),
        affiliateClicks,
      };
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const needingRefresh = normalized.filter((p) => Number.isFinite(p.updatedMs) && now - p.updatedMs > ninetyDaysMs);
  const avgScore = normalized.length
    ? Math.round(normalized.reduce((a, b) => a + b.score, 0) / normalized.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Content Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quality checks, refresh queue, and internal link health for Helpful Content signals.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="cyan">Avg score: {avgScore}/100</Badge>
          <Badge variant="default">Refresh queue: {needingRefresh.length}</Badge>
          <Badge variant="default">Published posts: {normalized.length}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle className="text-base">Posts needing refresh (90+ days)</CardTitle>
            <CardDescription>Old content is a freshness risk. Refresh is automated monthly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {needingRefresh.slice(0, 10).map((p) => (
              <div
                key={p.slug}
                className="rounded-2xl bg-white/[0.02] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{p.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">/blog/{p.slug}</div>
                  </div>
                  <Badge variant="default">{p.score}/100</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Updated: {p.updatedISO}</div>
              </div>
            ))}
            {needingRefresh.length === 0 ? <div className="text-sm text-muted-foreground">No posts need refresh.</div> : null}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle className="text-base">Internal link health</CardTitle>
            <CardDescription>Target: 5+ dofollow internal links per post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {normalized.slice(0, 10).map((p) => (
              <div
                key={p.slug}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.02] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">/blog/{p.slug}</div>
                </div>
                <Badge variant={p.internalLinks >= 5 ? "cyan" : "default"}>{p.internalLinks} links</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/40">
        <CardHeader>
          <CardTitle className="text-base">Tracking</CardTitle>
          <CardDescription>GA4 events are emitted for scroll depth, shares, helpful votes, and affiliate clicks.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="rounded-2xl bg-white/[0.02] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="text-xs">Affiliate click rates</div>
            <div className="mt-1 font-medium text-foreground">Tracked in GA4</div>
          </div>
          <div className="rounded-2xl bg-white/[0.02] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="text-xs">Helpful votes</div>
            <div className="mt-1 font-medium text-foreground">Tracked in GA4</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
