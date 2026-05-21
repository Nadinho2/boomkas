import type { Metadata } from "next";
import Link from "next/link";

import { AffiliateButton } from "@/components/AffiliateButton";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Monthly AI Tools Rankings (2026)",
  description: generateMetaDescription({
    title: "Monthly AI Tools Rankings (2026)",
    description:
      "Monthly rankings of the best agentic AI tools, based on hands-on testing, real pricing, and workflow fit across popular categories.",
  }),
  alternates: canonicalAlternates("/rankings"),
  openGraph: {
    title: "Monthly AI Tools Rankings (2026)",
    description: generateMetaDescription({
      title: "Monthly AI Tools Rankings (2026)",
      description:
        "Monthly rankings of the best agentic AI tools, based on hands-on testing, real pricing, and workflow fit across popular categories.",
    }),
    url: canonicalUrl("/rankings"),
    type: "website",
    images: [{ url: "https://boomkas.com/og.png", alt: "Boomkas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monthly AI Tools Rankings (2026)",
    description: generateMetaDescription({
      title: "Monthly AI Tools Rankings (2026)",
      description:
        "Monthly rankings of the best agentic AI tools, based on hands-on testing, real pricing, and workflow fit across popular categories.",
    }),
    images: ["https://boomkas.com/og.png"],
  },
};

type RankedTool = {
  slug: string;
  name: string;
  category: string;
  pricing: string;
  rating: number;
  bestFor: string;
};

function toRankedTool(row: Record<string, unknown>): RankedTool | null {
  const slug = typeof row.slug === "string" ? row.slug : "";
  if (!slug) return null;
  const name = typeof row.name === "string" && row.name.trim().length ? row.name.trim() : slug;
  const category = typeof row.category === "string" ? row.category : "Uncategorized";
  const pricing = typeof row.pricing === "string" ? row.pricing : "Pricing needs verification";
  const rating = typeof row.rating === "number" ? row.rating : 0;
  const bestFor = typeof row.bestFor === "string" ? row.bestFor : "—";
  return { slug, name, category, pricing, rating, bestFor };
}

function parseCategories(raw: string) {
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : ["Uncategorized"];
}

function topByCategory(tools: RankedTool[], category: string, limit: number) {
  return tools
    .filter((t) => parseCategories(t.category).includes(category))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export default async function RankingsPage() {
  let tools: RankedTool[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("tools")
      .select("slug,name,category,pricing,rating,bestFor")
      .order("rating", { ascending: false })
      .limit(200);
    const rows = (data as Array<Record<string, unknown>> | null) ?? [];
    tools = rows.map(toRankedTool).filter((t): t is RankedTool => !!t);
  } catch {
    tools = [];
  }

  const categories = ["Coding Agents", "IDE Agents", "Workflow Automation", "Multi-Agent", "Personal Productivity"];
  const topOverall = tools.slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Rankings", url: canonicalUrl("/rankings") },
        ]}
      />
      <div className="mb-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="cyan">Monthly</Badge>
          <Badge variant="default">Hands-on</Badge>
          <Badge variant="default">2026</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Monthly AI Tools Rankings (2026)</h1>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
          These rankings prioritize real workflow fit, clear trade-offs, and verified pricing where available.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold tracking-tight">Top Overall</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topOverall.map((t, idx) => (
            <Card key={t.slug} className="flex flex-col">
              <CardHeader>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="default">#{idx + 1}</Badge>
                  <Badge variant="cyan">{t.rating ? `${t.rating.toFixed(1)}★` : "—"}</Badge>
                </div>
                <CardTitle className="text-xl">
                  <Link href={`/tools/${t.slug}`} className="hover:underline">
                    {t.name}
                  </Link>
                </CardTitle>
                <CardDescription className="mt-2">
                  <span className="font-medium text-foreground">Best for:</span> {t.bestFor}
                </CardDescription>
                <CardDescription className="mt-2">
                  <span className="font-medium text-foreground">Pricing:</span> {t.pricing}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex items-center justify-between gap-3">
                <Link href={`/tools/${t.slug}`} className="text-sm font-medium text-secondary hover:underline">
                  Read review →
                </Link>
                <AffiliateButton slug={t.slug} size="sm" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        {categories.map((cat) => {
          const top = topByCategory(tools, cat, 5);
          if (!top.length) return null;
          return (
            <div key={cat}>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight">{cat}</h2>
                <Link href={`/tools?categories=${encodeURIComponent(cat)}`} className="text-sm text-muted-foreground hover:underline">
                  View all in Tools →
                </Link>
              </div>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {top.map((t, idx) => (
                  <Card key={`${cat}-${t.slug}`} className="flex flex-col">
                    <CardHeader>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <Badge variant="default">#{idx + 1}</Badge>
                        <Badge variant="cyan">{t.rating ? `${t.rating.toFixed(1)}★` : "—"}</Badge>
                      </div>
                      <CardTitle className="text-xl">
                        <Link href={`/tools/${t.slug}`} className="hover:underline">
                          {t.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <span className="font-medium text-foreground">Best for:</span> {t.bestFor}
                      </CardDescription>
                      <CardDescription className="mt-2">
                        <span className="font-medium text-foreground">Pricing:</span> {t.pricing}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto flex items-center justify-between gap-3">
                      <Link href={`/tools/${t.slug}`} className="text-sm font-medium text-secondary hover:underline">
                        Read review →
                      </Link>
                      <AffiliateButton slug={t.slug} size="sm" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

