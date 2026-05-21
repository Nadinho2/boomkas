import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_PAGES } from "@/lib/categories";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Categories",
  description: generateMetaDescription({
    title: "Categories",
    description:
      "Explore Boomkas categories for AI tools and content clusters, including AI coding tools, writing tools, image tools, productivity, and marketing.",
  }),
  alternates: canonicalAlternates("/categories"),
};

export default function CategoriesIndexPage() {
  const url = canonicalUrl("/categories");
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Categories", url };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Categories", url },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">Topical authority</Badge>
            <Badge variant="default">Clusters</Badge>
            <Badge variant="default">Internal links</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            AI Tool Categories
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            Category pages act as cluster hubs: they introduce the topic, link to the best tools and articles, and help
            Google understand topical relevance.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_PAGES.map((c) => (
          <Card key={c.slug} className="border-border/60 bg-card/40">
            <CardHeader className="space-y-2">
              <CardTitle className="text-base">
                <Link href={`/categories/${c.slug}`} className="hover:underline">
                  {c.title}
                </Link>
              </CardTitle>
              <CardDescription>Cluster hub + curated links.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {c.intro.split("\n\n")[0]?.slice(0, 150)}…
              </div>
              <Link href={`/categories/${c.slug}`} className="mt-4 inline-block text-sm font-medium text-[color:var(--primary)] hover:underline">
                View category →
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

