import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { createSupabaseServerClient } from "@/lib/supabase";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";
import { defaultAuthor } from "@/lib/authors";
import { plainStringToPortableText } from "@/lib/portableText";
import { sanityFetchPostBySlug, sanityFetchPublishedPosts, type SanityBlock } from "@/lib/sanity";
import { safeFormatDate } from "@/lib/utils";
import { ArticleSchema } from "@/components/schema/ArticleSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { AffiliateDisclosureBanner } from "@/components/blog/AffiliateDisclosureBanner";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { FaqAccordion, type FaqItem } from "@/components/blog/FaqAccordion";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { PostEnhancements } from "@/components/blog/PostEnhancements";
import { StarRating } from "@/components/blog/StarRating";
import { TldrBox } from "@/components/blog/TldrBox";
import { TocLinks } from "@/components/blog/TocLinks";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComparisonTable } from "@/components/ComparisonTable";

type BlogCategory =
  | "Coding Agents"
  | "Workflow Automation"
  | "Multi-Agent Systems"
  | "Beginner Guides"
  | "Tool Comparisons"
  | "Productivity Tips";

type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

type BlogPost = {
  slug: string;
  title: string;
  metaTitle?: string;
  description: string;
  excerpt: string;
  dateISO: string;
  updatedISO: string;
  lastTestedISO: string;
  readingMinutes: number;
  category: BlogCategory;
  intent: "Informational" | "Commercial" | "Navigational";
  hasAffiliate: boolean;
  author: string;
  heroImageAlt: string;
  heroImageDataUri: string;
  toc?: TocItem[];
  content: ReactNode;
};

const AUTHOR = "Boomkas Team";

const HERO_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'%3E%3Cdefs%3E%3CradialGradient id='a' cx='20%25' cy='10%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='rgba(0,240,255,0.35)'/%3E%3Cstop offset='60%25' stop-color='rgba(0,0,0,0)'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='90%25' cy='70%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='rgba(255,107,0,0.28)'/%3E%3Cstop offset='60%25' stop-color='rgba(0,0,0,0)'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='rgb(6,10,20)'/%3E%3Crect width='1600' height='900' fill='url(%23a)'/%3E%3Crect width='1600' height='900' fill='url(%23b)'/%3E%3C/svg%3E";

const HIDDEN_POST_SLUGS = new Set(["extra-prevention-tip-recommended"]);

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-semibold tracking-tight sm:text-2xl">
      {children}
    </h2>
  );
}

function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-24 text-base font-semibold tracking-tight sm:text-lg">
      {children}
    </h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-7 text-muted-foreground sm:text-base">{children}</p>;
}

function Ul({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground sm:text-base">{children}</ul>;
}

function Li({ children }: { children: ReactNode }) {
  return <li className="leading-7">{children}</li>;
}

const POSTS: BlogPost[] = [
  {
    slug: "best-agentic-ai-tools-2026",
    title: "Best Agentic AI Tools 2026 – Complete Buyer’s Guide",
    metaTitle: "Best Agentic AI Tools 2026: The Ultimate Comparison Guide",
    description:
      "Discover the top 25+ best agentic AI tools in 2026. In-depth comparison of Cursor, Trae, Lovable, Claude, n8n, CrewAI and more with pricing, autonomy levels, and real recommendations.",
    excerpt:
      "Discover the best agentic AI tools 2026 across coding, workflow automation, and multi-agent systems—plus honest recommendations and a buyer’s checklist.",
    dateISO: "2026-04-20",
    updatedISO: "2026-04-20",
    lastTestedISO: "2026-04-20",
    readingMinutes: 20,
    category: "Tool Comparisons",
    intent: "Commercial",
    hasAffiliate: false,
    author: AUTHOR,
    heroImageAlt: "Futuristic gradient hero image placeholder",
    heroImageDataUri: HERO_PLACEHOLDER,
    toc: [
      { id: "introduction", label: "Introduction", level: 2 },
      { id: "evaluation", label: "How We Evaluated", level: 2 },
      { id: "comparison-table", label: "Interactive Comparison Table", level: 2 },
      { id: "top-picks", label: "Top 5 Picks by Use Case", level: 2 },
      { id: "top-10", label: "Detailed Breakdown of Top 10 Tools", level: 2 },
      { id: "checklist", label: "Buyer’s Checklist", level: 2 },
      { id: "faq", label: "FAQ", level: 2 },
      { id: "conclusion", label: "Conclusion", level: 2 },
    ],
    content: (
      <div className="space-y-10">
        <section className="space-y-4">
          <H2 id="introduction">Introduction</H2>
          <P>
            2026 is the year agentic AI stopped being a novelty and became a real productivity layer. The shift wasn’t
            just “better chat.” It was the combination of strong reasoning models, safer tool use, and agentic UX patterns
            that let tools plan, execute, and verify work with minimal hand-holding. Agents now draft code changes across
            files, run scripts, fill forms, update CRMs, orchestrate multi-step automations, and coordinate multiple
            sub-agents in parallel.
          </P>
          <P>
            The biggest reason agentic AI exploded in 2026 is that workflows finally became end-to-end. Instead of
            answering questions, tools now complete tasks: create a plan, do the work, show receipts (diffs, logs,
            artifacts), and ask for approval at the right moments. That makes agentic tools usable by teams—not only by
            early adopters willing to babysit every step.
          </P>
          <P>
            That explosion also created a problem: the market is noisy. Many products call themselves “agents” while
            offering little more than prompt templates. Others have genuine autonomy but require careful guardrails to be
            safe in production. This buyer’s guide is designed to help you pick the right tool with clear recommendations
            based on real-world use cases: coding, workflow automation, multi-agent systems, beginner-friendly app
            building, and enterprise governance.
          </P>
          <P>
            You’ll also notice a practical theme throughout this guide: the best agentic stacks combine autonomy with
            verification. If a tool can’t explain what it did (and why), show logs, or validate the output, it’s not a
            serious “agent”—it’s a fragile prompt loop.
          </P>
          <P>
            Primary keyword: <span className="text-foreground font-medium">best agentic ai tools 2026</span>. If you’re
            deciding between Cursor vs Trae vs Claude, or n8n vs Zapier Agents vs Make, you’re in the right place.
          </P>
        </section>

        <section className="space-y-4">
          <H2 id="evaluation">How We Evaluated the Tools</H2>
          <P>
            We evaluated 25+ tools using four criteria that predict real outcomes—not just flashy demos. You can use this
            same rubric to evaluate any new agentic AI tool that shows up next week.
          </P>
          <Ul>
            <Li>
              <span className="text-foreground">Autonomy</span>: Can it plan multi-step work, call tools safely, and
              iterate? Does it support approvals, retries, and validation?
            </Li>
            <Li>
              <span className="text-foreground">Pricing & value</span>: Is there a usable free tier? Does cost scale
              predictably with usage? Is the ROI obvious for the target user?
            </Li>
            <Li>
              <span className="text-foreground">Ease of use</span>: How fast can a new user produce a trustworthy result?
              Does the UI provide clarity: what happened, why, and what’s next?
            </Li>
            <Li>
              <span className="text-foreground">Integrations</span>: IDE quality, app connectors, API/SDK depth, and
              enterprise controls (SSO, audit logs, permissions).
            </Li>
          </Ul>
          <H3 id="evaluation-autonomy">Autonomy Levels (Low / Medium / High)</H3>
          <P>
            Autonomy is not “how smart the model is.” Autonomy is the tool’s ability to execute multi-step work safely.
            Here’s how we interpret the common labels in 2026:
          </P>
          <Ul>
            <Li>
              <span className="text-foreground">Low</span>: assists with drafts and suggestions, but rarely executes tools
              or takes action without heavy guidance.
            </Li>
            <Li>
              <span className="text-foreground">Medium</span>: can run structured workflows with guardrails (routing,
              extraction, playbooks), but typically needs oversight for risky actions.
            </Li>
            <Li>
              <span className="text-foreground">High</span>: can plan, call tools, iterate, and produce verifiable
              artifacts (diffs, logs, structured outputs), with approvals and validation built into the workflow.
            </Li>
          </Ul>
          <H3 id="evaluation-what-matters">What Matters More Than “Features”</H3>
          <P>
            For buyers, the most predictive signals are: clear execution logs, easy rollback/review (diffs and approvals),
            strong defaults for safety, and predictable pricing. Tools that optimize those four traits usually win long
            term—even if their demo looks less magical.
          </P>
          <P>
            One more thing: we favor tools that keep humans in the loop without slowing them down. The best agentic
            systems feel like a fast co-pilot with a disciplined review loop—not a black box.
          </P>
        </section>

        <section className="space-y-4">
          <H2 id="comparison-table">Interactive Comparison Table</H2>
          <P>
            Use the interactive table below to search by tool name, filter by category, and sort by rating, autonomy, or
            pricing. If you want the full dataset with every filter and sorting option, open the dedicated tools page.
          </P>
          <P>
            Tip: if you’re shopping for a specific workflow, filter by category first, then sort by rating and scan the
            “Best For” column. When you find a tool that matches your use case, open its full review page to see the
            pricing breakdown, pros/cons, and comparisons.
          </P>
          <div className="pt-2">
            <ComparisonTable
              variant="compact"
              limit={25}
              title="Compare the Best Agentic AI Tools (2026)"
              description="Search and filter 25+ agentic tools by category, autonomy, pricing, and real-world fit."
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href="/tools">Open Full Comparison</Link>
            </Button>
            <Button asChild>
              <Link href="/tools?categories=Coding%20Agents">Filter: Coding Agents</Link>
            </Button>
          </div>
        </section>

        <section className="space-y-5">
          <H2 id="top-picks">Top 5 Picks by Use Case</H2>
          <P>
            If you only want the shortlist, start here. These picks optimize for outcomes—not brand hype. Each pick links
            to a full review page with structured data and detailed breakdowns.
          </P>
          <P>
            The goal of this section is speed: if you can only test one tool this week, start with the pick for your
            primary workflow. Then add a second tool only if you hit a hard limitation (integrations, governance, or
            flexibility).
          </P>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="border-border/60 bg-card/40">
              <CardHeader>
                <CardTitle className="text-base">Best for Coding (Daily Driver)</CardTitle>
                <CardDescription>Fast edits, multi-file changes, tight IDE loop.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>
                  Pick:{" "}
                  <Link href="/tools/cursor" className="font-medium text-[color:var(--primary)] hover:underline">
                    Cursor
                  </Link>
                </div>
                <div>
                  Why: best-in-class multi-file editing (Composer) plus a reliable agent mode for real daily work.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/40">
              <CardHeader>
                <CardTitle className="text-base">Best for Workflow Automation (Control + ROI)</CardTitle>
                <CardDescription>Automations that scale with guardrails.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>
                  Pick:{" "}
                  <Link href="/tools/n8n" className="font-medium text-[color:var(--primary)] hover:underline">
                    n8n
                  </Link>
                </div>
                <div>
                  Why: self-hostable, flexible, and agent-ready. Best long-term cost and privacy story for dev-led teams.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/40">
              <CardHeader>
                <CardTitle className="text-base">Best for Multi-Agent Systems (Production Discipline)</CardTitle>
                <CardDescription>State, retries, checkpoints, and approvals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>
                  Pick:{" "}
                  <Link href="/tools/langgraph" className="font-medium text-[color:var(--primary)] hover:underline">
                    LangGraph
                  </Link>
                </div>
                <div>Why: durable workflows with explicit routing, checkpointing, and reliability primitives.</div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/40">
              <CardHeader>
                <CardTitle className="text-base">Best for Beginners (Ship an MVP Fast)</CardTitle>
                <CardDescription>Plain English → working app, minimal setup.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>
                  Pick:{" "}
                  <Link href="/tools/lovable" className="font-medium text-[color:var(--primary)] hover:underline">
                    Lovable
                  </Link>
                </div>
                <div>
                  Why: rapid full-stack prototyping with code ownership. Perfect for founders and non-coders validating an
                  idea.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/40 sm:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Best for Enterprise (Governance + Ecosystem)</CardTitle>
                <CardDescription>Security, compliance, admin controls, auditability.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>
                  Pick:{" "}
                  <Link
                    href="/tools/copilot-studio"
                    className="font-medium text-[color:var(--primary)] hover:underline"
                  >
                    Microsoft Copilot Studio
                  </Link>
                </div>
                <div>
                  Why: if you live in Microsoft 365, it’s the most natural path to governed agents with Graph integration.
                </div>
              </CardContent>
            </Card>
          </div>

          <P>
            Honorable mentions:{" "}
            <Link href="/tools/trae" className="text-[color:var(--primary)] hover:underline">
              Trae
            </Link>{" "}
            for value and custom agents,{" "}
            <Link href="/tools/claude-code" className="text-[color:var(--primary)] hover:underline">
              Claude (Anthropic)
            </Link>{" "}
            for reasoning depth, and{" "}
            <Link href="/tools/crewai" className="text-[color:var(--primary)] hover:underline">
              CrewAI
            </Link>{" "}
            for role-based multi-agent teams.
          </P>
          <P>
            Best practice in 2026: pair a “builder” tool with a “verifier.” For example, use Lovable to generate an MVP
            quickly, then harden and refactor inside Cursor or Trae. Or use Claude for planning and long-context analysis,
            then execute in an IDE agent with tests and diffs.
          </P>
        </section>

        <section className="space-y-6">
          <H2 id="top-10">Detailed Breakdown of Top 10 Tools</H2>
          <P>
            Below are the top 10 tools we recommend most often in 2026. These are not “the only good tools,” but they’re
            the most consistently useful across real workflows.
          </P>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-cursor">1) Cursor</H3>
              <P>
                Cursor is the most polished AI-native IDE in 2026. Composer makes multi-file editing feel natural, and
                agent mode helps you delegate small-to-medium tasks without losing control of your codebase.
              </P>
              <Ul>
                <Li>
                  Best for: everyday coding, refactors, multi-file edits, PR-ready summaries.
                </Li>
                <Li>
                  Pricing: $16–20/mo Pro (limited free tier). Great value if you ship frequently.
                </Li>
                <Li>
                  Tip: constrain scope, run tests early, and let Composer handle batches instead of giant one-shot changes.
                </Li>
              </Ul>
              <P>
                What Cursor does best is the “edit loop”: it keeps you close to the code, proposes concrete diffs, and
                makes multi-file changes feel reviewable. The agent is strong, but the product’s real advantage is the UX
                discipline around execution and iteration.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Composer makes multi-file refactors fast and predictable.</Li>
                    <Li>Great ergonomics for daily development (inline + chat + context).</Li>
                    <Li>Strong model integrations and practical agent loops.</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Heavy usage almost always requires the Pro plan.</Li>
                    <Li>Custom agent frameworks are less flexible than Trae for power users.</Li>
                    <Li>As with any IDE agent, safety comes from tests + review discipline.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/tools/cursor" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
                  Read the full Cursor review →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-trae">2) Trae</H3>
              <P>
                Trae (ByteDance) is the value king: a generous free tier plus SOLO/Builder Mode for turning natural
                language into a full app. It shines for builders who want custom agent teams without enterprise spend.
              </P>
              <Ul>
                <Li>Best for: budget developers, app building, custom agents and orchestration.</Li>
                <Li>Pricing: generous free tier; Lite $3–10/mo; Pro roughly $10–30/mo depending on usage.</Li>
                <Li>Tip: use SOLO/Builder Mode to draft an MVP, then harden with tests and smaller refactor passes.</Li>
              </Ul>
              <P>
                Trae’s advantage is leverage: it gives you a powerful builder mode and a flexible agent framework at a
                price point that’s hard to match. It’s the tool we recommend when cost sensitivity and custom agents
                matter as much as raw polish.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Generous free tier with real capability.</Li>
                    <Li>SOLO/Builder Mode accelerates MVP and full-app scaffolds.</Li>
                    <Li>Custom agent creation and orchestration for specialized workflows.</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Pricing/limits can shift for heavy usage; track tiers and quotas.</Li>
                    <Li>Occasional edge-case polish trails Cursor’s daily-driver experience.</Li>
                    <Li>Some teams will have privacy/compliance concerns depending on policy.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/tools/trae" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
                  Read the full Trae review →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-claude">3) Claude (Anthropic)</H3>
              <P>
                Claude is the reasoning specialist. Long context, strong planning, and thoughtful safety make it a go-to
                for complex tasks—especially when paired with an IDE like Cursor or a workflow framework like LangGraph.
              </P>
              <Ul>
                <Li>Best for: deep reasoning, long-context codebases, agent teams and structured outputs.</Li>
                <Li>Pricing: usage-based Pro/Team plans; scales with heavy work.</Li>
                <Li>Tip: provide explicit success criteria and ask for a verification plan (tests, checks, diffs).</Li>
              </Ul>
              <P>
                Claude is most valuable when complexity is high: long documents, large repos, tricky tradeoffs, and tasks
                that require careful reasoning. It’s often the “planner and reviewer” in a two-tool stack, with an IDE or
                automation platform doing the execution.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Excellent reasoning quality for complex technical decisions.</Li>
                    <Li>Long-context workflows for large codebases and specs.</Li>
                    <Li>Strong for structured outputs (plans, checklists, risk analysis).</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Costs can add up for large contexts and long agent loops.</Li>
                    <Li>Not as seamless as IDE-native tools for applying code changes.</Li>
                    <Li>Still needs explicit guardrails for tool actions in production.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link
                  href="/tools/claude-code"
                  className="text-sm font-medium text-[color:var(--primary)] hover:underline"
                >
                  Read the full Claude review →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-lovable">4) Lovable</H3>
              <P>
                Lovable is one of the strongest “vibe coding” tools in 2026: describe an app in plain English and get a
                working full-stack implementation (UI + backend + auth + deploy). It’s ideal for founders and fast MVPs.
              </P>
              <Ul>
                <Li>Best for: non-coders, prototypes, quick SaaS MVPs, landing pages.</Li>
                <Li>Pricing: credit-based (limited free tier; paid plans for serious iteration).</Li>
                <Li>Tip: write a short requirements doc before prompting. Fewer iterations = lower cost and better code.</Li>
              </Ul>
              <P>
                Lovable’s superpower is speed-to-prototype. If you’re validating a startup idea, building a landing page,
                or creating a simple SaaS MVP, it can compress weeks into days. Just remember that “generated code” still
                needs engineering hardening for production: tests, security, error handling, and performance tuning.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Fastest path from idea → working app for non-coders.</Li>
                    <Li>Good UI defaults and modern stack output.</Li>
                    <Li>Code handoff makes it possible to productionize later.</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Credit pricing can get expensive with unfocused iteration.</Li>
                    <Li>Complex domain logic often needs an engineer to stabilize.</Li>
                    <Li>Debug loops can be frustrating if requirements are unclear.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/tools/lovable" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
                  Read the full Lovable review →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-n8n">5) n8n</H3>
              <P>
                n8n remains the best “control + cost” workflow platform for teams comfortable with a bit of engineering.
                Self-hosting gives you privacy and predictable economics, while AI nodes unlock agentic routing and
                reasoning steps.
              </P>
              <Ul>
                <Li>Best for: dev-led automation, self-hosting, privacy-sensitive workflows.</Li>
                <Li>Pricing: free self-hosted; cloud from about $20/mo.</Li>
                <Li>Tip: treat AI as a routing step, then keep core actions deterministic with retries and alerts.</Li>
              </Ul>
              <P>
                n8n is the long-term builder’s choice: it rewards teams who invest in workflow hygiene. If you define
                clear inputs/outputs, add retries, and keep “AI steps” constrained, you get durable automation that feels
                enterprise-grade without enterprise lock-in.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Self-hosting = privacy, control, and predictable economics.</Li>
                    <Li>Highly extensible with custom nodes and real integrations.</Li>
                    <Li>Strong patterns for retries, schedules, and error handling.</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Steeper learning curve than “click-and-go” tools.</Li>
                    <Li>Self-hosting means you own upgrades, backups, and monitoring.</Li>
                    <Li>Cloud plans can be costly at high throughput.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/tools/n8n" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
                  Read the full n8n review →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-make">6) Make.com</H3>
              <P>
                Make.com is the best visual automation platform for complex branching and data transformations. In 2026,
                AI agent nodes make it easier to classify, extract, and route work—while still keeping the workflow
                visible to operators.
              </P>
              <Ul>
                <Li>Best for: visual automations with complex logic, ETL workflows, marketing ops.</Li>
                <Li>Pricing: free tier; core plan from $9/mo (cost scales with operations).</Li>
                <Li>Tip: optimize operations count early—cost control is a workflow design skill.</Li>
              </Ul>
              <P>
                Make is the most “seeable” automation platform: you can understand the system at a glance. That visibility
                matters when agents are involved, because operators need to debug and trust the workflow. Make’s agentic
                steps are best used for classification and extraction—not for replacing deterministic logic.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Best visual builder for branching and data transformation.</Li>
                    <Li>Strong reliability primitives: retries, routes, iterators.</Li>
                    <Li>Great for ops, marketing, and non-developer stakeholders.</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Pricing scales with operations; inefficient workflows get expensive.</Li>
                    <Li>Large scenarios can become complex without good naming and structure.</Li>
                    <Li>Self-host control is limited compared to n8n.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/tools/make" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
                  Read the full Make.com review →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-crewai">7) CrewAI</H3>
              <P>
                CrewAI is the most approachable multi-agent framework for role-based teams. It’s great when you want
                agents with clear responsibilities and structured handoffs without building a full state graph.
              </P>
              <Ul>
                <Li>Best for: role-based agent teams (researcher, writer, critic), dev-led orchestration.</Li>
                <Li>Pricing: free open-source; optional paid cloud offerings.</Li>
                <Li>Tip: add evaluation checkpoints. Multi-agent systems are only as good as their verification.</Li>
              </Ul>
              <P>
                If you want multi-agent output without building heavy infrastructure, CrewAI is often the fastest path. It
                helps you make agent responsibilities explicit, which reduces “agent drift” and makes outcomes easier to
                evaluate.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Role-based mental model is easy to adopt and debug.</Li>
                    <Li>Strong for workflows like research → draft → critique.</Li>
                    <Li>Works with many model providers and toolchains.</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Reliability still depends on evaluation and guardrails.</Li>
                    <Li>Heavy LLM usage can be costly without budgets.</Li>
                    <Li>Production deployments require observability and controls.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/tools/crewai" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
                  Read the full CrewAI review →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-langgraph">8) LangGraph</H3>
              <P>
                LangGraph is the “production discipline” option. It’s built for durable workflows: checkpoints, retries,
                explicit routing, and human approvals. If you’ve been burned by prompt-loop chaos, LangGraph is the fix.
              </P>
              <Ul>
                <Li>Best for: stateful agent workflows, enterprise-grade reliability, resumability.</Li>
                <Li>Pricing: open source; paid cloud/enterprise add-ons exist.</Li>
                <Li>Tip: model the workflow explicitly (plan → act → validate → approve). Make failures visible.</Li>
              </Ul>
              <P>
                LangGraph is what you choose when reliability is the product. It helps teams turn fuzzy “agent behavior”
                into explicit, testable workflows. If you need auditability and resumability, this is the cleanest
                developer path.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Checkpoints and retries make failures recoverable.</Li>
                    <Li>Explicit routing reduces surprise and improves debuggability.</Li>
                    <Li>Great fit for human approvals and enterprise-style flows.</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Higher engineering effort than role-based or no-code tools.</Li>
                    <Li>Graph modeling adds complexity for simple projects.</Li>
                    <Li>Costs still depend on model calls and tool usage patterns.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/tools/langgraph" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
                  Read the full LangGraph review →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-zapier">9) Zapier Agents</H3>
              <P>
                Zapier Agents is the easiest path to agentic automation for business teams. It turns plain English into
                workflows across thousands of apps. You trade deep customization for speed, breadth, and reliability.
              </P>
              <Ul>
                <Li>Best for: non-technical teams, fast cross-app automation, large integration surface area.</Li>
                <Li>Pricing: free tier; pro from about $20/mo+ depending on usage.</Li>
                <Li>Tip: use approvals for high-impact actions (emails, CRM writes). Keep prompts specific.</Li>
              </Ul>
              <P>
                Zapier Agents is the “default” recommendation for business teams that don’t want to manage infrastructure.
                It’s easy to start, easy to share, and easy to operate. The tradeoff is customization and cost at scale.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Fastest path from “idea” to cross-app automation.</Li>
                    <Li>Huge integration ecosystem and battle-tested reliability.</Li>
                    <Li>Great for team adoption and non-technical operators.</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Costs can scale quickly with volume and premium apps.</Li>
                    <Li>Deep customization and complex logic can hit platform limits.</Li>
                    <Li>Agentic steps should be constrained; keep risky actions gated.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link
                  href="/tools/zapier-agents"
                  className="text-sm font-medium text-[color:var(--primary)] hover:underline"
                >
                  Read the full Zapier Agents review →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
              <H3 id="tool-copilot-studio">10) Microsoft Copilot Studio</H3>
              <P>
                Copilot Studio is the enterprise default when Microsoft 365 is your operating system. Deep Graph and
                Power Platform integration makes it extremely effective for internal agents—with strong governance.
              </P>
              <Ul>
                <Li>Best for: Microsoft-heavy enterprises, internal business automations, governance and compliance.</Li>
                <Li>Pricing: usage-based and tied to Microsoft Copilot/Power Platform licensing.</Li>
                <Li>Tip: define permissions and audit policies early—governance is a feature, not overhead.</Li>
              </Ul>
              <P>
                Copilot Studio is the choice when the ecosystem matters more than individual features. If your docs,
                meetings, approvals, and data already live in Microsoft 365, you’ll get faster adoption and safer
                operations by building inside that platform.
              </P>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">What we love</div>
                  <Ul>
                    <Li>Enterprise-grade governance: permissions, policies, and audit trails.</Li>
                    <Li>Deep Graph + M365 integration for internal workflows.</Li>
                    <Li>Strong fit for HR/finance/ops automation and knowledge workflows.</Li>
                  </Ul>
                </div>
                <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="text-sm font-semibold">Watchouts</div>
                  <Ul>
                    <Li>Cost and licensing complexity can be high for smaller teams.</Li>
                    <Li>Flexibility for external LLM/toolchains is usually constrained.</Li>
                    <Li>Requires admins and governance design to unlock full value.</Li>
                  </Ul>
                </div>
              </div>
              <div className="mt-3">
                <Link
                  href="/tools/copilot-studio"
                  className="text-sm font-medium text-[color:var(--primary)] hover:underline"
                >
                  Read the full Copilot Studio review →
                </Link>
              </div>
            </div>
          </div>

          <P>
            Want to explore the full list (25+ tools) including personal agents, browser operators, CRM-native systems,
            and developer-first automation platforms? Head to{" "}
            <Link href="/tools" className="text-[color:var(--primary)] hover:underline">
              /tools
            </Link>{" "}
            for the complete interactive comparison.
          </P>
        </section>

        <section className="space-y-4">
          <H2 id="checklist">Buyer’s Checklist: Which Tool Should You Choose?</H2>
          <P>
            Most people pick the wrong agentic tool because they start with features instead of workflows. Use this
            checklist to match the tool to your real constraints.
          </P>
          <Ul>
            <Li>
              If you want an IDE agent that feels like a daily driver, start with{" "}
              <Link href="/tools/cursor" className="text-[color:var(--primary)] hover:underline">
                Cursor
              </Link>{" "}
              or{" "}
              <Link href="/tools/trae" className="text-[color:var(--primary)] hover:underline">
                Trae
              </Link>
              .
            </Li>
            <Li>
              If you need predictable workflow automation with control, use{" "}
              <Link href="/tools/n8n" className="text-[color:var(--primary)] hover:underline">
                n8n
              </Link>{" "}
              (self-host) or{" "}
              <Link href="/tools/make" className="text-[color:var(--primary)] hover:underline">
                Make.com
              </Link>{" "}
              (visual).
            </Li>
            <Li>
              If you’re orchestrating multiple agents, decide whether you prefer role-based teams{" "}
              <span className="text-foreground">(CrewAI)</span> or state graphs with checkpoints{" "}
              <span className="text-foreground">(LangGraph)</span>.
            </Li>
            <Li>
              If you’re a founder shipping an MVP in days, choose{" "}
              <Link href="/tools/lovable" className="text-[color:var(--primary)] hover:underline">
                Lovable
              </Link>{" "}
              and then harden the exported code in an IDE agent.
            </Li>
            <Li>
              If governance is your top constraint, start with{" "}
              <Link href="/tools/copilot-studio" className="text-[color:var(--primary)] hover:underline">
                Copilot Studio
              </Link>{" "}
              (Microsoft) or{" "}
              <Link href="/tools/salesforce-agentforce" className="text-[color:var(--primary)] hover:underline">
                Agentforce
              </Link>{" "}
              (Salesforce).
            </Li>
            <Li>
              If you’re worried about agent mistakes, choose tools with approvals, logs, and validation loops—not just
              “autopilot” marketing.
            </Li>
          </Ul>
          <P>
            The fastest “safe” path for most teams: pick one primary tool per workflow category (IDE + automation + agent
            orchestration) and standardize patterns for approvals and verification.
          </P>
        </section>

        <section className="space-y-4">
          <H2 id="faq">FAQ</H2>
          <div className="space-y-3">
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold">What are the best agentic AI tools 2026 for developers?</div>
              <div className="mt-2 text-sm text-muted-foreground">
                For daily coding, Cursor is the most polished. For value and custom agents, Trae is outstanding. For deep
                reasoning, pair Claude with a strong IDE.
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold">What’s the best agentic workflow tool: n8n, Make, or Zapier?</div>
              <div className="mt-2 text-sm text-muted-foreground">
                n8n wins on control and self-hosting. Make wins on visual complexity. Zapier wins on ease and integration
                breadth for non-technical teams.
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold">Are “autonomous software engineers” like Devin ready?</div>
              <div className="mt-2 text-sm text-muted-foreground">
                They’re powerful, but production reliability still requires oversight. Use them as high-leverage helpers
                for senior teams with strong tests and clear guardrails.
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold">Do I need multi-agent systems to get value?</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Not always. Many teams get 80% of the value from a single high-quality agent + solid automation. Multi-agent
                systems shine when roles and parallelism matter.
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold">How do I keep agentic tools safe?</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Use least privilege, approvals for irreversible actions, logging, retries, and verification steps (tests,
                lint, validation). Treat autonomy like production infrastructure.
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold">Which tools are best for non-coders?</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Lovable is ideal for MVPs from natural language. Gumloop is great for no-code agent workflows. Zapier Agents
                is easiest for cross-app automations.
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold">Which tools are best for enterprise governance?</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Microsoft Copilot Studio and Salesforce Agentforce lead when you’re already in those ecosystems and need
                strong permissions, compliance, and auditability.
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold">What’s the simplest way to start?</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Pick one tool for your primary workflow (coding or automation), run one real project end-to-end, and
                standardize your guardrails. Then expand to multi-agent orchestration if needed.
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold">Where can I compare all tools quickly?</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Use the Boomkas comparison table on{" "}
                <Link href="/tools" className="text-[color:var(--primary)] hover:underline">
                  /tools
                </Link>{" "}
                to search, filter, and sort across 25+ agentic AI tools.
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <H2 id="conclusion">Conclusion + Next Step</H2>
          <P>
            The “best” agentic tool in 2026 depends on your workflow. For developers, IDE-native agents like Cursor and
            Trae deliver the fastest daily output. For automation, n8n and Make.com create reliable pipelines. For
            production-grade multi-agent systems, LangGraph is the discipline upgrade. For enterprise ecosystems, Copilot
            Studio and Agentforce bring governance.
          </P>
          <P>
            The easiest way to pick is to filter tools by your category, then choose the product that offers the best
            combination of autonomy and verification for your risk tolerance.
          </P>
          <Button asChild size="lg">
            <Link href="/tools">Compare All Tools on Boomkas →</Link>
          </Button>
        </section>
      </div>
    ),
  },
];

const POSTS_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(POSTS.map((p) => [p.slug, p]));

export const dynamicParams = true;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

function safeIsoDate(dateString: string | null | undefined) {
  if (!dateString) return new Date().toISOString();
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return new Date().toISOString();
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function safeDateMs(dateString: string | null | undefined) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    const t = date.getTime();
    return isNaN(t) ? null : t;
  } catch {
    return null;
  }
}

function formatDate(dateISO: string) {
  return safeFormatDate(dateISO);
}

function safeCategory(input: string | null | undefined): BlogCategory {
  if (
    input === "Coding Agents" ||
    input === "Workflow Automation" ||
    input === "Multi-Agent Systems" ||
    input === "Beginner Guides" ||
    input === "Tool Comparisons" ||
    input === "Productivity Tips"
  ) {
    return input;
  }
  return "Tool Comparisons";
}

function inferIntent(slug: string, title: string) {
  const s = `${slug} ${title}`.toLowerCase();
  if (s.includes("vs") || s.includes("-vs-") || s.includes("review") || s.includes("best")) return "Commercial" as const;
  if (s.includes("how-to") || s.includes("what-is") || s.includes("guide")) return "Informational" as const;
  if (s.includes("boomkas")) return "Navigational" as const;
  return "Informational" as const;
}

function readingMinutesFromText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function slugifyId(input: string) {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "section";
}

function parseInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  const renderLinks = (plain: string, keyPrefix: string) => {
    const nodes: ReactNode[] = [];
    const re = /\[([^\]]+)\]\(([^)]+)\)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let idx = 0;

    while ((m = re.exec(plain))) {
      if (m.index > last) {
        nodes.push(<span key={`${keyPrefix}-t-${idx++}`}>{plain.slice(last, m.index)}</span>);
      }
      const label = m[1];
      const href = m[2];
      const isInternal = href.startsWith("/");
      nodes.push(
        isInternal ? (
          <Link
            key={`${keyPrefix}-l-${idx++}`}
            href={href}
            className="font-medium text-[color:var(--primary)] hover:underline"
          >
            {label}
          </Link>
        ) : (
          <a
            key={`${keyPrefix}-l-${idx++}`}
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="font-medium text-[color:var(--primary)] hover:underline"
          >
            {label}
          </a>
        )
      );
      last = m.index + m[0].length;
    }

    if (last < plain.length) {
      nodes.push(<span key={`${keyPrefix}-t-${idx++}`}>{plain.slice(last)}</span>);
    }

    return nodes.length ? nodes : [<span key={`${keyPrefix}-t-0`}>{plain}</span>];
  };

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.92em] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={idx}>{renderLinks(part, String(idx))}</span>;
  });
}

function isHrLine(line: string) {
  const s = line.trim();
  if (s.length < 3) return false;
  return /^-+$/.test(s) || /^_+$/.test(s) || /^\*+$/.test(s);
}

function isMarkdownTableBlock(lines: string[]) {
  if (lines.length < 2) return false;
  const header = lines[0];
  const divider = lines[1];
  if (!header.includes("|")) return false;
  if (!divider.includes("-")) return false;
  const normalized = divider.replace(/\s/g, "");
  return /^[|:-]+$/.test(normalized);
}

function parseTableRow(line: string) {
  const trimmed = line.trim();
  const noOuter =
    trimmed.startsWith("|") && trimmed.endsWith("|") ? trimmed.slice(1, -1) : trimmed;
  return noOuter.split("|").map((c) => c.trim());
}

function tocFromMarkdown(text: string) {
  const lines = text.split("\n").map((l) => l.trim());
  const items: TocItem[] = [];

  for (const line of lines) {
    const h2 = line.startsWith("## ") ? line.slice(3).trim() : "";
    const h3 = line.startsWith("### ") ? line.slice(4).trim() : "";
    const label = h2 || h3;
    if (!label) continue;
    const level = h3 ? (3 as const) : (2 as const);
    items.push({ id: slugifyId(label), label, level });
  }

  return items.length ? items.slice(0, 30) : undefined;
}

function tocFromPortableText(blocks: SanityBlock[] | undefined) {
  const items: TocItem[] = [];
  for (const b of blocks ?? []) {
    if (!b || b._type !== "block") continue;
    const isH2 = b.style === "h2";
    const isH3 = b.style === "h3";
    if (!isH2 && !isH3) continue;
    const label = (b.children ?? []).map((c) => c.text).join("").trim();
    if (!label) continue;
    items.push({ id: slugifyId(label), label, level: isH3 ? 3 : 2 });
  }
  return items.length ? items.slice(0, 30) : undefined;
}

function plainTextFromPortableText(blocks: SanityBlock[] | undefined) {
  return (blocks ?? [])
    .filter((b) => b && b._type === "block")
    .map((b) => (b.children ?? []).map((c) => c.text).join(""))
    .join(" ");
}

function tldrBulletsFromText(text: string | undefined) {
  const raw = (text ?? "").trim();
  if (!raw) return [];
  return raw
    .split(/\r?\n+/)
    .map((l) => l.trim().replace(/^-+\s*/, ""))
    .filter(Boolean)
    .slice(0, 8);
}

function renderTextContent(text: string | null | undefined) {
  const raw = (text ?? "").trim();
  if (!raw) return <P>—</P>;

  const blocks = raw.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  let listBuffer: string[] = [];
  const nodes: ReactNode[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    nodes.push(
      <Ul key={`ul-${nodes.length}`}>
        {listBuffer.map((li) => (
          <Li key={li}>{li}</Li>
        ))}
      </Ul>
    );
    listBuffer = [];
  };

  blocks.forEach((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 1 && isHrLine(lines[0])) {
      flushList();
      nodes.push(<Separator key={`hr-${nodes.length}`} className="my-6" />);
      return;
    }

    if (lines.length > 0 && lines.every((l) => l.startsWith(">"))) {
      flushList();
      const quote = lines.map((l) => l.replace(/^>\s?/, "")).join("\n");
      nodes.push(
        <blockquote
          key={`quote-${nodes.length}`}
          className="rounded-2xl border border-border/70 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        >
          {parseInline(quote)}
        </blockquote>
      );
      return;
    }

    if (isMarkdownTableBlock(lines)) {
      flushList();
      const headers = parseTableRow(lines[0]);
      const rows = lines.slice(2).map(parseTableRow).filter((r) => r.some(Boolean));

      nodes.push(
        <div key={`table-${nodes.length}`} className="w-full overflow-x-auto rounded-2xl">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                {headers.map((h) => (
                  <TableHead key={h}>{parseInline(h)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  {headers.map((_, j) => (
                    <TableCell key={j} className="align-top">
                      {parseInline(r[j] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
      return;
    }

    const isList = lines.every((l) => l.startsWith("- "));
    if (isList) {
      lines.forEach((l) => listBuffer.push(l.replace(/^- /, "").trim()));
      return;
    }

    flushList();

    if (block.startsWith("## ")) {
      const label = block.replace(/^##\s+/, "").trim();
      nodes.push(
        <H2 key={`h2-${nodes.length}`} id={slugifyId(label)}>
          {label}
        </H2>
      );
      return;
    }

    if (block.startsWith("### ")) {
      const label = block.replace(/^###\s+/, "").trim();
      nodes.push(
        <H3 key={`h3-${nodes.length}`} id={slugifyId(label)}>
          {label}
        </H3>
      );
      return;
    }

    nodes.push(<P key={`p-${nodes.length}`}>{parseInline(block)}</P>);
  });

  flushList();
  return <div className="space-y-4">{nodes}</div>;
}

async function getDbPostBySlug(slug: string): Promise<BlogPost | null> {
  if (HIDDEN_POST_SLUGS.has(slug)) return null;
  let data: Record<string, unknown> | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const res = await supabase
      .from("posts")
      .select("slug,title,excerpt,content,category,status,published_at,updated_at,created_at")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (res.error || !res.data) return null;
    data = res.data as unknown as Record<string, unknown>;
  } catch {
    return null;
  }

  const rowSlug = (data.slug as string | null) ?? "";
  if (!rowSlug) return null;

  const title = (data.title as string | null) ?? "Untitled";
  const excerpt =
    ((data.excerpt as string | null) ?? "").trim() ||
    (((data.content as string | null) ?? "").trim().slice(0, 180) || "—");
  const dateISO =
    (data.published_at as string | null) ??
    (data.updated_at as string | null) ??
    (data.created_at as string | null) ??
    new Date().toISOString();
  const updatedISO =
    (data.updated_at as string | null) ??
    (data.published_at as string | null) ??
    (data.created_at as string | null) ??
    dateISO;
  const content = (data.content as string | null) ?? "";

  return {
    slug: rowSlug,
    title,
    description: excerpt,
    excerpt,
    dateISO,
    updatedISO,
    lastTestedISO: updatedISO,
    readingMinutes: readingMinutesFromText([title, excerpt, content].join(" ")),
    category: safeCategory(data.category as string | null),
    intent: inferIntent(rowSlug, title),
    hasAffiliate: content.includes("/go/"),
    author: AUTHOR,
    heroImageAlt: "Futuristic gradient hero image placeholder",
    heroImageDataUri: HERO_PLACEHOLDER,
    toc: tocFromMarkdown(content),
    content: renderTextContent(content),
  };
}

function pickRelatedPosts(current: BlogPost) {
  const candidates = POSTS.filter((p) => p.slug !== current.slug);
  const score = (p: BlogPost) => {
    let s = 0;
    if (p.category === current.category) s += 3;
    const a = safeDateMs(p.dateISO) ?? Date.now();
    const b = safeDateMs(current.dateISO) ?? Date.now();
    s += Math.max(0, 20 - Math.abs(a - b) / 8.64e7);
    return s;
  };
  return [...candidates].sort((a, b) => score(b) - score(a)).slice(0, 3);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const sanity = await sanityFetchPostBySlug(slug).catch(() => null);
  if (sanity) {
    const url = canonicalUrl(`/blog/${sanity.slug}`);
    const title = `${(sanity.seoTitle ?? sanity.title).trim()} | Boomkas`;
    const description = generateMetaDescription({ title, description: sanity.metaDescription ?? "" });
    const image = canonicalUrl(`/blog/${sanity.slug}/opengraph-image`);
    return {
      title,
      description,
      alternates: canonicalAlternates(`/blog/${sanity.slug}`),
      openGraph: {
        title,
        description,
        url,
        type: "article",
        publishedTime: sanity.publishedAt,
        authors: [sanity.author?.name ?? "Boomkas Team"],
        images: [{ url: image, width: 1200, height: 630, alt: "Boomkas" }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  }

  let post: BlogPost | null = null;
  try {
    post = POSTS_BY_SLUG[slug] ?? (await getDbPostBySlug(slug));
  } catch {
    post = null;
  }
  if (!post) return {};

  const url = canonicalUrl(`/blog/${post.slug}`);
  const title = `${post.metaTitle ?? post.title} | Boomkas`;
  const description = generateMetaDescription({ title, description: post.description });
  const image = canonicalUrl(`/blog/${post.slug}/opengraph-image`);

  return {
    title,
    description,
    alternates: canonicalAlternates(`/blog/${post.slug}`),
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.dateISO,
      authors: [post.author],
      images: [{ url: image, width: 1200, height: 630, alt: "Boomkas" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const sanity = await sanityFetchPostBySlug(slug).catch(() => null);
  let post: BlogPost | null = null;
  let faqItems: FaqItem[] = [];
  let starRating: number | null = null;
  let tldrBullets: string[] = [];
  let showDisclosure = false;
  let related: BlogPost[] = [];
  let popular: BlogPost[] = [];

  if (sanity) {
    const blocks =
      sanity.body && sanity.body.length
        ? sanity.body
        : sanity.contentMarkdown
          ? plainStringToPortableText(sanity.contentMarkdown)
          : [];
    const bodyText = sanity.contentMarkdown ?? plainTextFromPortableText(blocks);
    const excerpt = (sanity.metaDescription ?? "").trim() || bodyText.trim().slice(0, 180) || "—";

    const publishedISO = safeIsoDate(sanity.publishedAt);
    const updatedISO = safeIsoDate(sanity._updatedAt ?? publishedISO);
    const lastTestedISO = safeIsoDate(sanity.lastTested ?? publishedISO);

    const category = (sanity.category as BlogCategory | undefined) ?? "Tool Comparisons";
    const readingMinutes = readingMinutesFromText([sanity.title, excerpt, bodyText].join(" "));
    const intent = inferIntent(sanity.slug, sanity.title);
    const hasAffiliate = (sanity.affiliateDisclosure ?? "").length > 0 || bodyText.includes("/go/");
    const heroAlt = (sanity.featuredImageAlt ?? "Futuristic gradient hero image placeholder").trim();

    post = {
      slug: sanity.slug,
      title: sanity.title,
      metaTitle: sanity.seoTitle,
      description: sanity.metaDescription ?? excerpt,
      excerpt,
      dateISO: publishedISO,
      updatedISO,
      lastTestedISO,
      readingMinutes,
      category,
      intent,
      hasAffiliate,
      author: sanity.author?.name ?? AUTHOR,
      heroImageAlt: heroAlt,
      heroImageDataUri: HERO_PLACEHOLDER,
      toc: tocFromPortableText(blocks),
      content: <PortableTextRenderer value={blocks} />,
    };

    starRating = typeof sanity.starRating === "number" ? sanity.starRating : null;
    tldrBullets = tldrBulletsFromText(sanity.tldr);
    showDisclosure = hasAffiliate;
    faqItems = (sanity.faq ?? [])
      .map((f) => ({ question: String(f.question ?? "").trim(), answer: String(f.answer ?? "").trim() }))
      .filter((f) => f.question.length > 0 && f.answer.length > 0)
      .slice(0, 20);

    const sanityIndex = await sanityFetchPublishedPosts({ limit: 60 }).catch(() => []);
    const indexPosts: BlogPost[] = sanityIndex
      .filter((p) => p.slug !== sanity.slug)
      .map((p) => {
        const dateISO = safeIsoDate(p.publishedAt ?? p._updatedAt);
        const title = p.title ?? p.slug;
        const excerpt = (p.metaDescription ?? "").trim() || "—";
        const category = safeCategory((p.category as string | undefined) ?? "Tool Comparisons");
        return {
          slug: p.slug,
          title,
          excerpt,
          description: excerpt,
          dateISO,
          updatedISO: dateISO,
          lastTestedISO: dateISO,
          readingMinutes: readingMinutesFromText([title, excerpt].join(" ")),
          category,
          intent: inferIntent(p.slug, title),
          hasAffiliate: false,
          author: AUTHOR,
          heroImageAlt: "Futuristic gradient hero image placeholder",
          heroImageDataUri: HERO_PLACEHOLDER,
          toc: undefined,
          content: <P>—</P>,
        };
      });

    related = indexPosts.filter((p) => p.category === category).slice(0, 3);
    if (related.length < 3) {
      related = [
        ...related,
        ...indexPosts.filter((p) => !related.some((r) => r.slug === p.slug)).slice(0, 3 - related.length),
      ];
    }
    popular = indexPosts.slice(0, 5);
  } else {
    post = POSTS_BY_SLUG[slug] ?? (await getDbPostBySlug(slug).catch(() => null));
    if (post) {
      const currentSlug = post.slug;
      related = pickRelatedPosts(post);
      popular = POSTS.filter((p) => p.slug !== currentSlug).slice(0, 5);
      tldrBullets = [
        post.excerpt,
        `Intent: ${post.intent}. Format matches search intent with scannable headings, a TL;DR, and clear takeaways.`,
        "We update posts when pricing and feature lists change, and we label affiliate links for transparency.",
      ];
      showDisclosure = post.hasAffiliate;
    }
  }
  if (!post) notFound();
  const url = canonicalUrl(`/blog/${post.slug}`);
  const isFresh = (() => {
    const updatedMs = safeDateMs(post.updatedISO);
    if (!updatedMs) return false;
    return Date.now() - updatedMs < 30 * 24 * 60 * 60 * 1000;
  })();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <ArticleSchema
        title={post.title}
        description={generateMetaDescription({ title: post.title, description: post.description })}
        url={url}
        datePublished={post.dateISO}
        dateModified={post.updatedISO}
        authorName={post.author}
        imageUrl={canonicalUrl(`/blog/${post.slug}/opengraph-image`)}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Blog", url: canonicalUrl("/blog") },
          { name: post.title, url: url },
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-white/30">
            /
          </li>
          <li>
            <Link href="/blog" className="transition hover:text-foreground">
              Blog
            </Link>
          </li>
          <li aria-hidden className="text-white/30">
            /
          </li>
          <li className="text-foreground">{post.title}</li>
        </ol>
      </nav>

      <div className="mt-6 overflow-hidden rounded-3xl bg-white/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        <div className="relative">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={post.heroImageDataUri}
              alt={post.heroImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              className="object-cover"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.65),rgba(0,0,0,0.92))]"
          />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-12 sm:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{post.category}</Badge>
              <Badge variant="cyan">{post.intent}</Badge>
              {isFresh ? <Badge variant="default">Freshness</Badge> : null}
              {typeof starRating === "number" ? <StarRating value={starRating} /> : null}
              <div className="text-xs text-white/70">
                {formatDate(post.dateISO)} • {post.readingMinutes} min read •{" "}
                <Link href="/authors/boomkas-team" className="underline-offset-2 hover:underline">
                  {post.author}
                </Link>{" "}
                • Updated {formatDate(post.updatedISO)} • Last tested {formatDate(post.lastTestedISO)}
              </div>
            </div>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 max-w-3xl text-pretty text-sm text-white/70 sm:text-base">{post.excerpt}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="sm:w-auto">
                <Link href="/tools">Explore Tools</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="sm:w-auto">
                <Link href="/">Try Agent Simulator</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <article className="space-y-8">
          <TldrBox
            bullets={
              tldrBullets.length
                ? tldrBullets
                : [
                    post.excerpt,
                    `Intent: ${post.intent}. Format matches search intent with scannable headings, a TL;DR, and clear takeaways.`,
                    "We update posts when pricing and feature lists change, and we label affiliate links for transparency.",
                  ]
            }
          />

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Our Testing Process</CardTitle>
              <CardDescription>How we create first-hand review signals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
              <ul className="list-disc space-y-2 pl-5">
                <li>Run a real workflow end-to-end (plan → execute → verify) instead of single-shot prompts.</li>
                <li>Check reliability across multiple runs and document where it breaks.</li>
                <li>Validate pricing and feature claims, then update the page when changes ship.</li>
                <li>Publish at least one unique decision insight learned during testing.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">What We Found</CardTitle>
              <CardDescription>Real-world observations from testing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Decision shortcut: choose tools by workflow fit first (coding vs automation vs multi-agent), then
                  optimize for autonomy under verification.
                </li>
                <li>
                  Practical insight: the fastest teams pair an agent with a lightweight checklist (tests, diffs, and
                  approvals) to prevent rework.
                </li>
                <li>Update habit: treat pricing and feature lists as versioned data, not one-time copy.</li>
              </ul>
            </CardContent>
          </Card>

          {showDisclosure ? <AffiliateDisclosureBanner /> : null}

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Newsletter</CardTitle>
              <CardDescription>Weekly tactics, tool drops, and agent workflows. No spam.</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterForm source={`blog:${post.slug}:mid`} />
            </CardContent>
          </Card>

          <div className="rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
            {post.content}
          </div>

          {faqItems.length ? <FaqAccordion items={faqItems} /> : null}

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Screenshots & Outputs</CardTitle>
              <CardDescription>Visual proof and example results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="aspect-[16/10] rounded-2xl bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]" />
                <div className="aspect-[16/10] rounded-2xl bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]" />
              </div>
              <div>Placeholder slots for future screenshots and real outputs.</div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Video Demo</CardTitle>
              <CardDescription>Embed space for future tool walkthroughs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-2xl bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]" />
            </CardContent>
          </Card>

          <PostEnhancements slug={post.slug} url={url} title={post.title} />

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Newsletter</CardTitle>
              <CardDescription>Weekly tactics, tool drops, and agent workflows. No spam.</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterForm source={`blog:${post.slug}:end`} />
            </CardContent>
          </Card>

          {related.length > 0 ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Related Posts</h2>
                <Link href="/blog" className="text-sm font-medium text-[color:var(--primary)] hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((p) => (
                  <Card
                    key={p.slug}
                    className="overflow-hidden border-border/60 bg-card/40 transition hover:border-[color:var(--primary)]/30 hover:bg-card/55"
                  >
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={p.heroImageDataUri}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 320px"
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default">{p.category}</Badge>
                        <div className="text-xs text-muted-foreground">{p.readingMinutes} min</div>
                      </div>
                      <CardTitle className="text-sm leading-snug">
                        <Link href={`/blog/${p.slug}`} className="transition hover:text-[color:var(--primary)]">
                          {p.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          <AuthorBox author={defaultAuthor()} lastTestedISO={post.lastTestedISO} updatedISO={post.updatedISO} />
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {post.toc && post.toc.length > 0 ? (
            <Card className="border-border/60 bg-card/40">
              <CardHeader>
                <CardTitle className="text-base">Table of Contents</CardTitle>
                <CardDescription>Jump to sections.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <TocLinks slug={post.slug} items={post.toc} />
              </CardContent>
            </Card>
          ) : null}

          {popular.length ? (
            <Card className="border-border/60 bg-card/40">
              <CardHeader>
                <CardTitle className="text-base">Popular Posts</CardTitle>
                <CardDescription>More helpful reads.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {popular.map((p) => (
                  <div key={p.slug} className="rounded-2xl bg-white/[0.02] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                    <Link href={`/blog/${p.slug}`} className="text-sm font-semibold hover:underline">
                      {p.title}
                    </Link>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {p.readingMinutes} min • {p.category}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">See How Tools Compare</CardTitle>
              <CardDescription>Jump to the comparison table for 2026 tools.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/tools">Compare Tools</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
