import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: generateMetaDescription({
    title: "Privacy Policy",
    description:
      "Boomkas privacy policy covering analytics, cookies, affiliate links, and how we handle contact requests and user data.",
  }),
  alternates: canonicalAlternates("/privacy"),
};

export default function PrivacyPolicyPage() {
  const url = canonicalUrl("/privacy");
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: "Privacy Policy", url };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Privacy", url },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">Privacy</Badge>
            <Badge variant="default">Analytics</Badge>
            <Badge variant="default">Cookies</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            This policy explains what we collect, why we collect it, and your choices.
          </p>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>What we collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              We collect standard web analytics such as page views, referrers, device/browser information, and
              engagement events (scroll depth, clicks on links, and newsletter actions). We also record affiliate link
              click events to understand which pages are helpful.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Cookies may be used by analytics and affiliate partners. You can block cookies in your browser settings,
              but some functionality may degrade.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Contact requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              If you email us, we retain the message for support and corrections. We do not sell personal information.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Email{" "}
              <a href="mailto:hello@boomkas.com" className="font-medium text-[color:var(--primary)] hover:underline">
                hello@boomkas.com
              </a>{" "}
              for privacy questions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

