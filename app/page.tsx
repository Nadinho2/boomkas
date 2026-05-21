import Link from "next/link";

import { AgentSimulator } from "@/components/AgentSimulator";
import { ComparisonTable } from "@/components/ComparisonTable";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden">
        <HeroBackdrop />
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge variant="cyan">2026 Playbook</Badge>
                <Badge variant="default">RSC-first</Badge>
                <Badge variant="default">Core Web Vitals obsessed</Badge>
              </div>

              <h1 className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
                Boom Your Productivity with Agentic AI in 2026
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                Discover, compare, and master the best agentic AI tools that plan, reason, and execute workflows autonomously.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="primary">
                  <Link href="/tools">Explore Tools</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <a href="#simulator">Try Agent Simulator</a>
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <MiniStat label="Tools" value="30+" hint="Curated agents" />
                <MiniStat label="Filters" value="Search + tags" hint="Find fast" />
                <MiniStat label="Vibes" value="Boom" hint="Cyan × Orange" />
              </div>
            </div>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,240,255,0.18),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.14),transparent_55%)]" />
              <CardContent className="relative p-6 sm:p-8">
                <p className="text-sm font-semibold tracking-tight">
                  What makes a tool “agentic” in 2026?
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  It doesn’t just chat. It plans, calls tools, handles state, and executes multi-step workflows with guardrails.
                </p>
                <div className="mt-6 grid gap-3">
                  <FeaturePill title="Plan" desc="Decompose goals into tasks" />
                  <FeaturePill title="Use tools" desc="APIs, web, code, docs, MCP" />
                  <FeaturePill title="Execute" desc="Ship outcomes, not drafts" />
                  <FeaturePill title="Report" desc="Summaries + change logs" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Top Tools, Instantly Compared</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start with the short list, then drill into reviews.
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden text-sm font-medium text-[color:var(--primary)] hover:underline sm:inline"
          >
            View all →
          </Link>
        </div>
        <ComparisonTable variant="compact" limit={10} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="cyan">Why trust Boomkas</Badge>
                <Badge variant="default">First-hand</Badge>
                <Badge variant="default">Updated</Badge>
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Builder-first reviews you can use</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                We review agentic AI tools by running practical workflows. We publish clear trade-offs, keep affiliate
                labels visible, and update pages when pricing and features change.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground sm:text-base">
                <li>Testing process and “what we found” sections on tool reviews</li>
                <li>Transparent disclosures on affiliate links</li>
                <li>Structured data, breadcrumbs, and internal link hubs for topical authority</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="secondary">
                  <Link href="/review-methodology">Review methodology</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/editorial-guidelines">Editorial guidelines</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="cyan">Press & mentions</Badge>
                <Badge variant="default">Coming soon</Badge>
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Mentions, citations, and linkable assets</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                We’re building assets that are easy to cite and share: comparison tables, rankings, and category hubs.
                If you mention Boomkas, we’ll keep the referenced pages updated.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/tools">Comparison table</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/categories">Category hubs</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/use-cases">By use case</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/glossary">AI glossary</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        id="simulator"
        className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28"
      >
        <AgentSimulator />
      </section>
    </div>
  );
}

function MiniStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function FeaturePill({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        <span className="text-xs text-muted-foreground">{desc}</span>
      </div>
    </div>
  );
}
