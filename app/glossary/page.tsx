import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GLOSSARY } from "@/lib/glossary";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Glossary",
  description: generateMetaDescription({
    title: "AI Glossary",
    description:
      "Plain-English glossary of key AI and agentic workflow terms used across Boomkas reviews and guides.",
  }),
  alternates: canonicalAlternates("/glossary"),
};

export default function GlossaryPage() {
  const url = canonicalUrl("/glossary");
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: "AI Glossary", url };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Glossary", url },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">Readability</Badge>
            <Badge variant="default">Definitions</Badge>
            <Badge variant="default">Helpful content</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">AI Glossary</h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            A quick reference for terms used across Boomkas reviews, comparisons, and guides.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        {GLOSSARY.map((g) => (
          <Card key={g.term} className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">{g.term}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground sm:text-base">
              {g.definition}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

