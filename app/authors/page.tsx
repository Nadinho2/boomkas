import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTHORS } from "@/lib/authors";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Authors",
  description: generateMetaDescription({
    title: "Authors",
    description:
      "Meet the Boomkas authors and reviewers behind our AI tool reviews, comparisons, and guides, including credentials and areas of expertise.",
  }),
  alternates: canonicalAlternates("/authors"),
  openGraph: {
    title: "Authors",
    description: generateMetaDescription({
      title: "Authors",
      description:
        "Meet the Boomkas authors and reviewers behind our AI tool reviews, comparisons, and guides, including credentials and areas of expertise.",
    }),
    url: canonicalUrl("/authors"),
    type: "website",
    images: [{ url: "https://boomkas.com/og.png", alt: "Boomkas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Authors",
    description: generateMetaDescription({
      title: "Authors",
      description:
        "Meet the Boomkas authors and reviewers behind our AI tool reviews, comparisons, and guides, including credentials and areas of expertise.",
    }),
    images: ["https://boomkas.com/og.png"],
  },
};

export default function AuthorsPage() {
  const people = Object.values(AUTHORS);
  const pageUrl = canonicalUrl("/authors");

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Boomkas Authors",
    url: pageUrl,
    isPartOf: { "@type": "WebSite", name: "Boomkas", url: canonicalUrl("/") },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Authors", url: pageUrl },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">E-E-A-T</Badge>
            <Badge variant="default">Credentials</Badge>
            <Badge variant="default">Transparency</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Authors & Reviewers
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            Boomkas is built for builders. We publish practical reviews and guides, and we make it clear who wrote and
            tested each piece.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <Card key={p.slug} className="overflow-hidden border-border/60 bg-card/40">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
                <Image src={p.photoDataUri} alt={`${p.name} photo`} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base">
                  <Link href={`/authors/${p.slug}`} className="hover:underline">
                    {p.name}
                  </Link>
                </CardTitle>
                <CardDescription className="mt-1">{p.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {p.expertise.slice(0, 4).map((e) => (
                  <Badge key={e} variant="default">
                    {e}
                  </Badge>
                ))}
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{p.bio}</p>
              <Link href={`/authors/${p.slug}`} className="text-sm font-medium text-[color:var(--primary)] hover:underline">
                View profile →
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

