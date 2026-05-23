import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FaqAccordion } from "@/components/blog/FaqAccordion";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SITE_ORIGIN, canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Agentic AI Guides",
  description: generateMetaDescription({
    title: "Agentic AI Guides",
    description:
      "New to AI agents? Start with these practical guides covering fundamentals, tool selection, workflow automation, and multi-agent systems with clear examples and checklists.",
  }),
  alternates: {
    ...canonicalAlternates("/guides"),
    languages: {
      "en-US": canonicalUrl("/guides"),
      "en-GB": canonicalUrl("/guides"),
      "en-CA": canonicalUrl("/guides"),
      "en-AU": canonicalUrl("/guides"),
      "en-IN": canonicalUrl("/guides"),
      "en-SG": canonicalUrl("/guides"),
    },
  },
  openGraph: {
    title: "Agentic AI Guides",
    description: generateMetaDescription({
      title: "Agentic AI Guides",
      description:
        "New to AI agents? Start with these practical guides covering fundamentals, tool selection, workflow automation, and multi-agent systems with clear examples and checklists.",
    }),
    url: canonicalUrl("/guides"),
    type: "website",
    images: [{ url: `${SITE_ORIGIN}/og.png`, alt: "Boomkas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic AI Guides",
    description: generateMetaDescription({
      title: "Agentic AI Guides",
      description:
        "New to AI agents? Start with these practical guides covering fundamentals, tool selection, workflow automation, and multi-agent systems with clear examples and checklists.",
    }),
    images: [`${SITE_ORIGIN}/og.png`],
  },
};

const GUIDES = [
  {
    slug: "agentic-ai-for-beginners",
    title: "Agentic AI for Beginners",
    desc: "A practical 0→1 guide: what agents are, how they work, and how to build your first reliable workflow.",
    time: "10 min read",
    difficulty: "Beginner",
  },
  {
    slug: "ai-agents-vs-ai-assistants",
    title: "AI Agents vs AI Assistants",
    desc: "The difference between “chat help” and systems that plan + execute with tools.",
    time: "6 min read",
    difficulty: "Beginner",
  },
  {
    slug: "how-to-choose-ai-agent",
    title: "How to Choose an AI Agent",
    desc: "A simple evaluation rubric: autonomy, integrations, reliability, security, and total cost.",
    time: "7 min read",
    difficulty: "Beginner",
  },
  {
    slug: "how-to-automate-workflows",
    title: "How to Automate Workflows with Agents",
    desc: "Turn repetitive work into durable automations—without building a fragile pile of prompts.",
    time: "12 min read",
    difficulty: "Intermediate",
  },
  {
    slug: "tool-use-and-guardrails",
    title: "Tool Use & Guardrails",
    desc: "How to safely connect agents to browsers, APIs, and databases (and keep them from doing damage).",
    time: "11 min read",
    difficulty: "Intermediate",
  },
  {
    slug: "multi-agent-systems-explained",
    title: "Multi‑Agent Systems Explained",
    desc: "When one agent isn’t enough: orchestration patterns, handoffs, and evaluation.",
    time: "15 min read",
    difficulty: "Advanced",
  },
];

const PATHS = [
  {
    title: "Start Here (0→1)",
    description: "Learn the concepts you need before you start wiring agents into real apps and data.",
    items: ["What agents are", "What “tool use” means", "How to evaluate reliability"],
    href: "/guides/agentic-ai-for-beginners",
    badge: "Beginner",
  },
  {
    title: "Pick a Tool",
    description: "Choose the right agent for your workflow and constraints—without getting lost in marketing.",
    items: ["Buying checklist", "Pricing pitfalls", "Security & data controls"],
    href: "/guides/how-to-choose-ai-agent",
    badge: "Beginner",
  },
  {
    title: "Automate a Workflow",
    description: "Ship something useful with clear steps, fallbacks, and human-in-the-loop review.",
    items: ["Task decomposition", "Retries & timeouts", "Observability basics"],
    href: "/guides/how-to-automate-workflows",
    badge: "Intermediate",
  },
];

const TOPICS = [
  { title: "Tool Selection", description: "How to compare autonomy, integrations, and real UX.", href: "/tools" },
  { title: "Workflow Design", description: "Prompts, policies, and steps that don’t collapse in production.", href: "/use-cases" },
  { title: "Comparisons", description: "Side‑by‑side breakdowns for common “A vs B” decisions.", href: "/compare" },
  { title: "Rankings", description: "Curated lists by category and criteria, updated regularly.", href: "/rankings" },
];

const FAQS = [
  {
    question: "What’s the fastest way to get started with agentic AI?",
    answer:
      "Start with a single workflow you run weekly (research, content briefing, lead enrichment, code review). Build a small agent loop: plan → execute with tools → validate output → ship. Keep the first version narrow, then expand scope once it’s reliable.",
  },
  {
    question: "How do I pick an agent tool without wasting money?",
    answer:
      "Choose based on the work you need done: integrations, run history, reliability controls (retries, tool permissions), and team/security needs. Then test 2–3 tools with the same task and success criteria before committing.",
  },
  {
    question: "Do I need multi-agent systems?",
    answer:
      "Usually not at the start. Most teams get further with one strong agent plus guardrails and review. Multi‑agent setups help when you need distinct roles (researcher, executor, verifier) or parallel work—but they’re harder to debug and evaluate.",
  },
];

export default function GuidesIndexPage() {
  const featured = GUIDES[0]!;
  const remaining = GUIDES.slice(1);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Guides", url: canonicalUrl("/guides") },
        ]}
      />
      <div className="mb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Agentic AI Guides
            </h1>
            <p className="mt-3 text-lg leading-7 text-muted-foreground">
              Practical, step-by-step playbooks for building reliable agent workflows: choosing tools, designing automations, adding guardrails, and scaling to multi-agent systems.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary" size="md">
              <Link href="/tools">Explore tools</Link>
            </Button>
            <Button asChild variant="ghost" size="md">
              <Link href="/compare">See comparisons</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-12">
        {PATHS.map((p) => (
          <Card key={p.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="cyan">{p.badge}</Badge>
              </div>
              <CardTitle className="text-xl">{p.title}</CardTitle>
              <CardDescription className="mt-2">{p.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {p.items.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href={p.href} className="text-sm font-medium text-primary hover:underline">
                Start this path →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-sm font-medium tracking-wide text-primary uppercase mb-4">Featured guide</h2>
        <Card className="flex flex-col overflow-hidden border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="cyan">{featured.difficulty}</Badge>
              <span className="text-xs text-muted-foreground flex items-center">{featured.time}</span>
            </div>
            <CardTitle className="text-2xl">{featured.title}</CardTitle>
            <CardDescription className="text-base mt-2">{featured.desc}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="primary" size="sm">
              <Link href={`/guides/${featured.slug}`}>Read the guide</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {remaining.map((guide) => (
          <Card key={guide.slug} className="flex flex-col">
            <CardHeader>
              <div className="flex gap-2 mb-3">
                <Badge variant="default">{guide.difficulty}</Badge>
                <span className="text-xs text-muted-foreground flex items-center">{guide.time}</span>
              </div>
              <CardTitle>{guide.title}</CardTitle>
              <CardDescription className="mt-2">{guide.desc}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link
                href={`/guides/${guide.slug}`}
                className="text-sm font-medium text-secondary hover:underline"
              >
                Read guide →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <hr className="my-14 border-border/60" />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Browse by topic</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Use these shortcuts when you already know what you’re trying to accomplish.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <Card key={t.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-base">{t.title}</CardTitle>
                  <CardDescription className="mt-2">{t.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Link href={t.href} className="text-sm font-medium text-primary hover:underline">
                    Explore →
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Get updates</h2>
          <p className="mt-3 text-muted-foreground">
            New guides and tool updates, sent occasionally.
          </p>
          <div className="mt-6 rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <NewsletterForm source="guides_index" />
          </div>
        </div>
      </div>

      <div className="mt-14">
        <FaqAccordion items={FAQS} />
      </div>
    </div>
  );
}
