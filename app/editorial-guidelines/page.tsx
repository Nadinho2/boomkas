import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Editorial Guidelines",
  description: generateMetaDescription({
    title: "Editorial Guidelines",
    description:
      "How Boomkas creates, tests, updates, and publishes AI tool reviews and guides, including disclosures, sourcing, and correction policy.",
  }),
  alternates: canonicalAlternates("/editorial-guidelines"),
};

export default function EditorialGuidelinesPage() {
  const url = canonicalUrl("/editorial-guidelines");
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: "Editorial Guidelines", url };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Editorial Guidelines", url },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">Helpful Content</Badge>
            <Badge variant="default">E-E-A-T</Badge>
            <Badge variant="default">Transparency</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Editorial Guidelines
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            Boomkas is built for builders. These guidelines explain how we test tools, write reviews, and keep content
            current so readers can trust what they’re seeing.
          </p>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>How we write</CardTitle>
            <CardDescription>Structure, intent, and clarity rules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              We match format to intent. Reviews focus on trade-offs, pricing details, and who the tool is best for.
              Guides prioritize step-by-step execution and checklists. Comparisons emphasize decision criteria and
              workflow fit.
            </p>
            <p>
              We keep paragraphs short, use scannable headings, and include TL;DR summaries for fast readers.
              Terminology is explained plainly, and we link to relevant internal resources and source citations when
              referencing statistics.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Corrections</CardTitle>
            <CardDescription>How we handle errors and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              If pricing, features, or claims are inaccurate, we update the page and reflect the change in the “Updated”
              and “Last tested” dates. If a correction materially changes a recommendation, we note it in the page
              content and adjust verdict wording and ratings.
            </p>
            <p>
              Send correction requests to{" "}
              <a href="mailto:hello@boomkas.com" className="font-medium text-[color:var(--primary)] hover:underline">
                hello@boomkas.com
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Affiliate disclosures</CardTitle>
            <CardDescription>How we earn and what we never do.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Some links are affiliate links. If you purchase through them, we may earn a commission at no extra cost to
              you. This never influences rankings. We do not sell placements or hide sponsored labels.
            </p>
            <p>
              We keep affiliate labels visible, and we add a disclosure banner to any page that includes affiliate
              links.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Testing philosophy</CardTitle>
            <CardDescription>What “first-hand experience” means here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              We test tools by running real workflows: building small projects, integrating with common stacks, and
              checking how well the agent handles multi-step execution under guardrails. When we cannot test a feature
              directly, we label it clearly and avoid overconfident claims.
            </p>
            <p>
              We publish at least one unique, actionable insight per review: a workflow tip, a practical limitation, or
              a decision heuristic learned from testing.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

