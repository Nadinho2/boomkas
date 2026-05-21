import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: generateMetaDescription({
    title: "Terms of Service",
    description:
      "Boomkas terms of service covering site usage, affiliate disclosures, limitations, and how to request corrections.",
  }),
  alternates: canonicalAlternates("/terms"),
};

export default function TermsPage() {
  const url = canonicalUrl("/terms");
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: "Terms of Service", url };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Terms", url },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">Terms</Badge>
            <Badge variant="default">Disclosure</Badge>
            <Badge variant="default">Corrections</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            By using Boomkas, you agree to these terms.
          </p>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Content on Boomkas is for informational purposes. We aim for accuracy but do not guarantee completeness or
              fitness for a particular purpose.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Affiliate links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Some outbound links are affiliate links. If you purchase through them, we may earn a commission. We do not
              accept payment for rankings.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Intellectual property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Site content is owned by Boomkas or its licensors. You may link to pages and share excerpts with proper
              attribution.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              For corrections or questions, email{" "}
              <a href="mailto:hello@boomkas.com" className="font-medium text-[color:var(--primary)] hover:underline">
                hello@boomkas.com
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

