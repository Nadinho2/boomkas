import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Boomkas — Independent Agentic AI Research",
  description: generateMetaDescription({
    title: "About Boomkas — Independent Agentic AI Research",
    description:
      "Boomkas is an independent platform comparing the best agentic AI tools in 2026. Learn how we research, rate, and recommend tools with transparent criteria.",
  }),
  alternates: canonicalAlternates("/about"),
  openGraph: {
    title: "About Boomkas — Independent Agentic AI Research",
    description: generateMetaDescription({
      title: "About Boomkas — Independent Agentic AI Research",
      description:
        "Boomkas is an independent platform comparing the best agentic AI tools in 2026. Learn how we research, rate, and recommend tools with transparent criteria.",
    }),
    url: canonicalUrl("/about"),
    type: "website",
    images: [{ url: "https://boomkas.com/og.png", alt: "Boomkas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Boomkas — Independent Agentic AI Research",
    description: generateMetaDescription({
      title: "About Boomkas — Independent Agentic AI Research",
      description:
        "Boomkas is an independent platform comparing the best agentic AI tools in 2026. Learn how we research, rate, and recommend tools with transparent criteria.",
    }),
    images: ["https://boomkas.com/og.png"],
  },
};

const STATS = [
  { title: "30+ Tools", desc: "Researched and compared" },
  { title: "2026", desc: "Continuously updated" },
  { title: "100% Independent", desc: "No paid placements" },
];

const CRITERIA = [
  { title: "Autonomy Level", desc: "Can it plan and execute without you?" },
  { title: "Real-world Usage", desc: "Does it hold up on actual projects?" },
  { title: "Pricing Clarity", desc: "Are the costs predictable?" },
  { title: "Integration Depth", desc: "Does it work with your stack?" },
  { title: "Active Development", desc: "Is the team shipping improvements?" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "About", url: canonicalUrl("/about") },
        ]}
      />
      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Built by builders, for builders
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
            Boomkas is an independent research platform helping developers and teams find the right agentic AI tools —
            without the noise.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle className="text-xl">Our Mission</CardTitle>
            <CardDescription>Why Boomkas exists — and how we stay useful.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              The agentic AI tool landscape is moving fast — and it’s easy to get overwhelmed by hype, pricing complexity,
              and a flood of “agent” claims that don’t hold up in real workflows.
            </p>
            <p>
              Boomkas was built to be independent, tested, and opinionated. We focus on outcomes: how tools behave on
              actual projects, where they break, and what they’re best used for.
            </p>
            <p>
              We’re here for developers, founders, and teams adopting AI who want clear recommendations, repeatable
              evaluation criteria, and a faster path to the right stack.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {STATS.map((s) => (
            <Card key={s.title} className="border-border/60 bg-card/40">
              <CardHeader>
                <CardTitle className="text-lg">{s.title}</CardTitle>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">How We Pick and Rate Tools</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          We use a consistent rubric so you can compare tools fairly — and understand exactly why something ranks where
          it does.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((c) => (
            <Card key={c.title} className="border-border/60 bg-card/40">
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
                <CardDescription>{c.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle className="text-xl">Why Trust Boomkas</CardTitle>
            <CardDescription>Experience, transparency, and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Helpful content is practical, specific, and updated. We add first-hand testing sections to reviews, keep
              affiliate labels visible, and publish author profiles so you can see who wrote and tested the content.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Testing checklists and “what we found” observations</li>
              <li>Clear disclosures for affiliate links</li>
              <li>Update cadence for pricing and feature changes</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle className="text-xl">Resources</CardTitle>
            <CardDescription>How we publish and how to navigate the site.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/review-methodology" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
              Review methodology
            </Link>
            <Link href="/editorial-guidelines" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
              Editorial guidelines
            </Link>
            <Link href="/authors" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
              Authors
            </Link>
            <Link href="/categories" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
              Categories
            </Link>
            <Link href="/glossary" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
              AI glossary
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <Card className="border-[color:var(--secondary)]/25 bg-[rgba(255,107,0,0.06)] shadow-[inset_0_0_0_1px_rgba(255,107,0,0.16)]">
          <CardHeader>
            <CardTitle className="text-lg">Affiliate Disclosure</CardTitle>
            <CardDescription>Required for transparency and trust.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground sm:text-base">
            Some links on Boomkas are affiliate links. If you purchase through them, we may earn a commission at no extra
            cost to you. This never influences our ratings or recommendations — tools are ranked on merit, not deals. We
            only recommend tools we would use ourselves.
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Get in Touch</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
          Email us at{" "}
          <a href="mailto:hello@boomkas.com" className="font-medium text-[color:var(--primary)] hover:underline">
            hello@boomkas.com
          </a>
          . Tool submissions, corrections, and partnership inquiries are welcome.
        </p>
      </section>
    </div>
  );
}
