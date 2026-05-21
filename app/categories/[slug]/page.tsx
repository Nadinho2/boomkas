import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_BY_SLUG, CATEGORY_PAGES } from "@/lib/categories";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const dynamicParams = true;

export function generateStaticParams() {
  return CATEGORY_PAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const page = CATEGORY_BY_SLUG[slug];
  if (!page) return {};

  const title = `${page.title} — Best Tools & Guides`;
  const description = generateMetaDescription({
    title,
    description:
      `Explore ${page.title.toLowerCase()} with a curated hub: practical intro, recommended tools, and internal links to related guides and comparisons.`,
  });

  return {
    title,
    description,
    alternates: canonicalAlternates(`/categories/${page.slug}`),
    openGraph: {
      title,
      description,
      url: canonicalUrl(`/categories/${page.slug}`),
      type: "website",
      images: [{ url: "https://boomkas.com/og.png", alt: "Boomkas" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://boomkas.com/og.png"],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const page = CATEGORY_BY_SLUG[slug];
  if (!page) notFound();

  const url = canonicalUrl(`/categories/${page.slug}`);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    url,
    isPartOf: { "@type": "WebSite", name: "Boomkas", url: canonicalUrl("/") },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Categories", url: canonicalUrl("/categories") },
          { name: page.title, url },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">Category hub</Badge>
            <Badge variant="default">300+ word intro</Badge>
            <Badge variant="default">Internal links</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            {page.title}
          </h1>
          <p className="mt-4 max-w-3xl whitespace-pre-line text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            {page.intro}
          </p>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Recommended tools</CardTitle>
            <CardDescription>Curated starting points.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {page.exampleToolSlugs.map((s) => (
              <div key={s} className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.02] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{s.replace(/-/g, " ").toUpperCase()}</div>
                  <div className="mt-1 text-sm text-muted-foreground">See review details and pricing.</div>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/tools/${s}`}>View</Link>
                </Button>
              </div>
            ))}
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href="/tools">Compare all tools</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
            <CardDescription>Build your cluster.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Category hubs work best when they link to a pillar page and supporting articles. Start by adding one
              comprehensive guide, then publish supporting posts that link back here and to the pillar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href="/guides">Read guides</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/blog">Browse articles</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/glossary">AI glossary</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

