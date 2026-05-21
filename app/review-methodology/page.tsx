import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Review Methodology",
  description: generateMetaDescription({
    title: "Review Methodology",
    description:
      "Boomkas review methodology: testing process, scoring rubric, update cadence, and how we evaluate autonomy, reliability, pricing, and workflows.",
  }),
  alternates: canonicalAlternates("/review-methodology"),
};

function ScoreRow({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-white/[0.02] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="mt-1 text-sm text-muted-foreground">{description}</div>
      </div>
      <Badge variant="default">Weighted</Badge>
    </div>
  );
}

export default function ReviewMethodologyPage() {
  const url = canonicalUrl("/review-methodology");
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: "Review Methodology", url };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Review Methodology", url },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">First-hand testing</Badge>
            <Badge variant="default">Updated</Badge>
            <Badge variant="default">Transparent scoring</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Review Methodology
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            Each Boomkas review is built around a repeatable testing process. We focus on real workflows, practical
            trade-offs, and clear decision criteria so you can choose faster.
          </p>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Our testing process</CardTitle>
            <CardDescription>What we do before we publish.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              We run a standard checklist: onboarding friction, core workflow completion, error recovery, and the
              quality of outputs across multiple tasks. For agentic tools, we also test autonomy under constraints:
              whether the tool can plan, execute multi-step tasks, and recover from partial failures without creating
              hidden mess.
            </p>
            <p>
              We record what we saw (not just what the marketing claims), add at least one unique workflow insight, and
              update pages when pricing and features change.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>What we score</CardTitle>
            <CardDescription>Signals that matter for builders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ScoreRow
              label="Workflow fit"
              description="How well the tool supports real end-to-end tasks (not isolated demos)."
            />
            <ScoreRow
              label="Autonomy + control"
              description="Plans and executes reliably while staying verifiable and safe."
            />
            <ScoreRow
              label="Quality of outputs"
              description="Code/UI quality, correctness, and consistency across runs."
            />
            <ScoreRow
              label="Integrations"
              description="Connectors, API surface, and how practical it is to ship to production."
            />
            <ScoreRow
              label="Pricing clarity"
              description="Transparent pricing and predictable cost for common usage."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

