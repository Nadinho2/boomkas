import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: generateMetaDescription({
    title: "Contact",
    description:
      "Contact Boomkas for corrections, partnership inquiries, or press questions. We respond via email and keep review disclosures transparent.",
  }),
  alternates: canonicalAlternates("/contact"),
};

export default function ContactPage() {
  const url = canonicalUrl("/contact");
  const schema = { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact", url };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Contact", url },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">Contact</Badge>
            <Badge variant="default">Corrections</Badge>
            <Badge variant="default">Press</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">Contact Boomkas</h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            For corrections, questions, and press inquiries, email{" "}
            <a href="mailto:hello@boomkas.com" className="font-medium text-[color:var(--primary)] hover:underline">
              hello@boomkas.com
            </a>
            .
          </p>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>Fastest way to reach us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Email{" "}
              <a href="mailto:hello@boomkas.com" className="font-medium text-[color:var(--primary)] hover:underline">
                hello@boomkas.com
              </a>{" "}
              and include the page URL if you’re reporting an error.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Newsletter signup</CardTitle>
            <CardDescription>Get weekly updates on agentic AI tools.</CardDescription>
          </CardHeader>
          <CardContent>
            <NewsletterForm source="contact" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
