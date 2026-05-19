"use client";

import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, ExternalLink, Search, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
};

export type AutonomyLevel = "Low" | "Medium" | "High";

export type ToolCategory =
  | "Coding Agents"
  | "IDE Agents"
  | "Workflow Automation"
  | "No-Code Builders"
  | "Multi-Agent"
  | "Personal Productivity"
  | "Enterprise";

export type ToolRow = {
  slug: string;
  name: string;
  bestFor: string;
  pricing: string;
  autonomy: AutonomyLevel;
  categories: ToolCategory[];
  features: string[];
  rating: number;
  affiliateUrl: string;
  hasReview?: boolean;
  website?: string;
  actionLabel?: "Try Now" | "Get Deal";
};

const ALL_CATEGORIES: ToolCategory[] = [
  "Coding Agents",
  "IDE Agents",
  "Workflow Automation",
  "No-Code Builders",
  "Multi-Agent",
  "Personal Productivity",
  "Enterprise",
];

const TOOL_ROWS: ToolRow[] = [
  {
    slug: "cursor",
    name: "Cursor",
    bestFor: "Everyday coding, multi-file editing, and developer workflows",
    pricing: "$16–20/mo Pro (limited free tier) • Teams/Enterprise",
    autonomy: "High",
    categories: ["Coding Agents", "IDE Agents"],
    features: ["Composer", "Agent mode", "Codebase context", "Chat + inline AI"],
    rating: 4.6,
    affiliateUrl: "/go/cursor",
    hasReview: true,
    website: "https://cursor.com",
    actionLabel: "Get Deal",
  },
  {
    slug: "claude-code",
    name: "Claude (Anthropic)",
    bestFor: "Complex reasoning, long-context tasks, coding agents",
    pricing: "Usage-based (Pro / Team plans)",
    autonomy: "High",
    categories: ["Coding Agents", "Multi-Agent"],
    features: ["Projects", "Agent Teams", "Up to 1M context", "Strong reasoning"],
    rating: 4.5,
    affiliateUrl: "/go/claude-code",
    hasReview: true,
    website: "https://www.anthropic.com",
    actionLabel: "Try Now",
  },
  {
    slug: "trae",
    name: "Trae",
    bestFor: "Budget developers, full app building, custom agent teams",
    pricing: "Generous free tier • Lite $3–10/mo • Pro $10–30/mo",
    autonomy: "High",
    categories: ["Coding Agents", "IDE Agents"],
    features: ["SOLO/Builder Mode", "Custom agents", "Premium models", "Tool calling + web search"],
    rating: 4.35,
    affiliateUrl: "/go/trae",
    hasReview: true,
    actionLabel: "Try Now",
  },
  {
    slug: "lovable",
    name: "Lovable",
    bestFor: "Founders and non-coders building MVPs fast",
    pricing: "Credit-based (limited free tier, paid plans)",
    autonomy: "High",
    categories: ["Coding Agents", "No-Code Builders"],
    features: ["Natural language → app", "Visual editor", "GitHub handoff", "Modern stack"],
    rating: 4.2,
    affiliateUrl: "/go/lovable",
    hasReview: true,
    actionLabel: "Get Deal",
  },
  {
    slug: "devin",
    name: "Devin AI",
    bestFor: "Advanced software engineering and complex project automation",
    pricing: "Enterprise / Usage-based (limited public access)",
    autonomy: "High",
    categories: ["Coding Agents", "Multi-Agent"],
    features: ["End-to-end planning", "Browser + terminal", "Debugging loops", "Project execution"],
    rating: 4.3,
    affiliateUrl: "/go/devin",
    hasReview: true,
    website: "https://www.cognition.ai",
    actionLabel: "Get Deal",
  },
  {
    slug: "windsurf",
    name: "Windsurf",
    bestFor: "Developers seeking next-gen AI coding experiences",
    pricing: "Subscription-based (varies)",
    autonomy: "High",
    categories: ["Coding Agents", "IDE Agents"],
    features: ["Multi-step reasoning", "Codebase understanding", "Autonomous planning", "LLM integrations"],
    rating: 4.2,
    affiliateUrl: "/go/windsurf",
    hasReview: true,
    website: "https://codeium.com/windsurf",
    actionLabel: "Try Now",
  },
  {
    slug: "pearai",
    name: "PearAI",
    bestFor: "AI-powered coding environment with guided project workflows",
    pricing: "Free tier • $18/mo Pro",
    autonomy: "Medium",
    categories: ["Coding Agents", "IDE Agents"],
    features: ["Guided flows", "Code actions", "Docs context", "Local tooling"],
    rating: 4.1,
    affiliateUrl: "/go/pearai",
    hasReview: true,
    website: "https://pearai.com",
    actionLabel: "Try Now",
  },
  {
    slug: "zed-agent",
    name: "Zed (Agent Features)",
    bestFor: "Ultra-fast editor with assistant/agent actions in a minimal UI",
    pricing: "Free • Paid AI add-ons",
    autonomy: "Medium",
    categories: ["IDE Agents", "Coding Agents"],
    features: ["Low-latency editor", "Inline actions", "Repo search", "AI add-ons"],
    rating: 4.2,
    affiliateUrl: "/go/zed-agent",
    hasReview: true,
    website: "https://zed.dev",
    actionLabel: "Try Now",
  },
  {
    slug: "n8n",
    name: "n8n",
    bestFor: "Developers and teams who want full control and self-hosting",
    pricing: "Free self-hosted • Cloud from $20/mo",
    autonomy: "High",
    categories: ["Workflow Automation"],
    features: ["Self-hostable", "AI agent nodes", "Custom nodes", "Error handling"],
    rating: 4.45,
    affiliateUrl: "/go/n8n",
    hasReview: true,
    website: "https://n8n.io",
    actionLabel: "Get Deal",
  },
  {
    slug: "zapier-agents",
    name: "Zapier Agents",
    bestFor: "Business users and teams wanting simple yet powerful automations",
    pricing: "Free tier • Pro from $20/mo+",
    autonomy: "Medium",
    categories: ["Workflow Automation", "No-Code Builders"],
    features: ["7k+ apps", "Natural language", "Retries", "Team collaboration"],
    rating: 4.3,
    affiliateUrl: "/go/zapier-agents",
    hasReview: true,
    website: "https://zapier.com",
    actionLabel: "Try Now",
  },
  {
    slug: "make",
    name: "Make.com",
    bestFor: "Users who want powerful visual automations with AI",
    pricing: "Free tier • Core from $9/mo",
    autonomy: "High",
    categories: ["Workflow Automation", "No-Code Builders"],
    features: ["Visual scenarios", "AI agent nodes", "Conditionals", "Data transforms"],
    rating: 4.35,
    affiliateUrl: "/go/make",
    hasReview: true,
    website: "https://www.make.com",
    actionLabel: "Get Deal",
  },
  {
    slug: "relay",
    name: "Relay.app",
    bestFor: "Teams looking for a modern, reliable automation platform",
    pricing: "Paid plans ~ $25–50/mo",
    autonomy: "High",
    categories: ["Workflow Automation"],
    features: ["Clean UI", "AI agent nodes", "Monitoring", "Approvals"],
    rating: 4.25,
    affiliateUrl: "/go/relay",
    hasReview: true,
    website: "https://relay.app",
    actionLabel: "Try Now",
  },
  {
    slug: "gumloop",
    name: "Gumloop",
    bestFor: "Non-technical users and marketers building AI automations",
    pricing: "Free tier • Solo ~$37/mo",
    autonomy: "Medium",
    categories: ["No-Code Builders", "Workflow Automation"],
    features: ["No-code builder", "Templates", "Data scraping", "Sharing"],
    rating: 4.15,
    affiliateUrl: "/go/gumloop",
    hasReview: true,
    website: "https://gumloop.com",
    actionLabel: "Get Deal",
  },
  {
    slug: "lindy",
    name: "Lindy",
    bestFor: "Busy professionals, executives, and solopreneurs",
    pricing: "Starts at $49/month",
    autonomy: "High",
    categories: ["Personal Productivity"],
    features: ["Inbox management", "Calendar scheduling", "Research", "Workflows"],
    rating: 4.25,
    affiliateUrl: "/go/lindy",
    hasReview: true,
    website: "https://lindy.ai",
    actionLabel: "Try Now",
  },
  {
    slug: "crewai",
    name: "CrewAI",
    bestFor: "Developers building collaborative AI agent teams",
    pricing: "Free open-source • Paid cloud options",
    autonomy: "High",
    categories: ["Multi-Agent", "Coding Agents"],
    features: ["Role-based agents", "Delegation", "Memory", "Human-in-loop"],
    rating: 4.4,
    affiliateUrl: "/go/crewai",
    hasReview: true,
    website: "https://crewai.com",
    actionLabel: "Try Now",
  },
  {
    slug: "langgraph",
    name: "LangGraph (LangChain)",
    bestFor: "Stateful multi-agent workflows for developers (graphs + checkpoints)",
    pricing: "Open source • Cloud/enterprise add-ons",
    autonomy: "High",
    categories: ["Multi-Agent", "Coding Agents"],
    features: ["State graphs", "Checkpoints", "Retries", "Tool routing"],
    rating: 4.3,
    affiliateUrl: "/go/langgraph",
    hasReview: true,
    website: "https://langchain.com/langgraph",
    actionLabel: "Try Now",
  },
  {
    slug: "autogen",
    name: "AutoGen",
    bestFor: "Multi-agent conversation and collaboration for research + execution",
    pricing: "Open source • Hosted offerings vary",
    autonomy: "Medium",
    categories: ["Multi-Agent"],
    features: ["Agent chat", "Tool calling", "Orchestration", "Extensible"],
    rating: 4.1,
    affiliateUrl: "/go/autogen",
    hasReview: true,
    website: "https://github.com/microsoft/autogen",
    actionLabel: "Try Now",
  },
  {
    slug: "taskade-genesis",
    name: "Taskade Genesis",
    bestFor: "No-code agent orchestration for teams (tasks + agents + knowledge)",
    pricing: "Free tier • $20/mo Pro • Teams",
    autonomy: "Medium",
    categories: ["Multi-Agent", "No-Code Builders", "Personal Productivity"],
    features: ["Agent templates", "Team workspaces", "Knowledge base", "Task execution"],
    rating: 4.2,
    affiliateUrl: "/go/taskade-genesis",
    hasReview: true,
    website: "https://www.taskade.com",
    actionLabel: "Get Deal",
  },
  {
    slug: "copilot-studio",
    name: "Microsoft Copilot Studio",
    bestFor: "Enterprises and teams already using Microsoft 365",
    pricing: "Usage-based (part of Microsoft Copilot licensing)",
    autonomy: "High",
    categories: ["Enterprise", "Workflow Automation"],
    features: ["Graph integration", "Security + compliance", "Governance", "Agent builder"],
    rating: 4.4,
    affiliateUrl: "/go/copilot-studio",
    hasReview: true,
    website: "https://copilotstudio.microsoft.com",
    actionLabel: "Try Now",
  },
  {
    slug: "workbeaver",
    name: "Workbeaver",
    bestFor: "Prompt-to-action personal agent for daily ops and lightweight workflows",
    pricing: "Free tier • $15/mo Pro",
    autonomy: "Medium",
    categories: ["Personal Productivity"],
    features: ["Prompt-to-action", "Inbox workflows", "Templates", "Task execution"],
    rating: 4.0,
    affiliateUrl: "/go/workbeaver",
    hasReview: true,
    website: "https://workbeaver.ai",
    actionLabel: "Try Now",
  },
  {
    slug: "manus",
    name: "Manus",
    bestFor: "Browser-based autonomous agent for research, forms, and web tasks",
    pricing: "Free tier • $25/mo Pro",
    autonomy: "High",
    categories: ["Personal Productivity"],
    features: ["Browser agent", "Research", "Form fill", "Task replay"],
    rating: 4.2,
    affiliateUrl: "/go/manus",
    hasReview: true,
    website: "https://manus.ai",
    actionLabel: "Try Now",
  },
  {
    slug: "stack-ai",
    name: "Stack AI",
    bestFor: "Agent platform for teams (internal tools, workflows, and ops)",
    pricing: "From $49/mo • Team/Enterprise",
    autonomy: "Medium",
    categories: ["Enterprise", "Workflow Automation"],
    features: ["Team agents", "Connectors", "Workflows", "Permissions"],
    rating: 4.1,
    affiliateUrl: "/go/stack-ai",
    hasReview: true,
    website: "https://www.stack-ai.com",
    actionLabel: "Get Deal",
  },
  {
    slug: "airops",
    name: "AirOps",
    bestFor: "AI operations agents for content, SEO, and repeatable playbooks",
    pricing: "From $99/mo • Enterprise",
    autonomy: "Medium",
    categories: ["Enterprise", "Workflow Automation"],
    features: ["Playbooks", "Content ops", "Approvals", "Analytics"],
    rating: 4.0,
    affiliateUrl: "/go/airops",
    hasReview: true,
    website: "https://www.airops.com",
    actionLabel: "Get Deal",
  },
  {
    slug: "openai-operator",
    name: "OpenAI Operator",
    bestFor: "Advanced agent capabilities with tool use and robust execution loops",
    pricing: "Usage-based • Team plans",
    autonomy: "High",
    categories: ["Multi-Agent", "Personal Productivity"],
    features: ["Tool use", "Planning loops", "Web actions", "Robust execution"],
    rating: 4.6,
    affiliateUrl: "/go/openai-operator",
    hasReview: true,
    website: "https://openai.com",
    actionLabel: "Try Now",
  },
  {
    slug: "salesforce-agentforce",
    name: "Salesforce Agentforce",
    bestFor: "CRM-embedded agents for pipeline, support, and RevOps automation",
    pricing: "Enterprise pricing • Usage add-ons",
    autonomy: "Medium",
    categories: ["Enterprise"],
    features: ["CRM actions", "Governance", "Customer context", "Approval flows"],
    rating: 4.1,
    affiliateUrl: "/go/salesforce-agentforce",
    hasReview: true,
    website: "https://www.salesforce.com",
    actionLabel: "Get Deal",
  },
  {
    slug: "relevance-ai",
    name: "Relevance AI",
    bestFor: "Agent workflows for teams with data connectors and evaluation",
    pricing: "Free tier • From $49/mo",
    autonomy: "Medium",
    categories: ["Workflow Automation", "Enterprise"],
    features: ["Agent builder", "Data connectors", "Evaluations", "Team workspaces"],
    rating: 4.2,
    affiliateUrl: "/go/relevance-ai",
    hasReview: true,
    website: "https://relevanceai.com",
    actionLabel: "Try Now",
  },
  {
    slug: "decagon",
    name: "Decagon",
    bestFor: "Support agents that resolve tickets with business-safe guardrails",
    pricing: "Enterprise pricing",
    autonomy: "High",
    categories: ["Enterprise"],
    features: ["Support automation", "Guardrails", "Tool calling", "Audit logs"],
    rating: 4.3,
    affiliateUrl: "/go/decagon",
    hasReview: true,
    website: "https://decagon.ai",
    actionLabel: "Get Deal",
  },
  {
    slug: "pipedream-agents",
    name: "Pipedream Agents",
    bestFor: "Developer-first automation + agent steps with real code and APIs",
    pricing: "Free tier • From $29/mo",
    autonomy: "Medium",
    categories: ["Workflow Automation", "Coding Agents"],
    features: ["API workflows", "Run code", "Webhooks", "Agent steps"],
    rating: 4.2,
    affiliateUrl: "/go/pipedream-agents",
    hasReview: true,
    website: "https://pipedream.com",
    actionLabel: "Try Now",
  },
  {
    slug: "bardeen",
    name: "Bardeen",
    bestFor: "Browser + app automations with lightweight agent triggers",
    pricing: "Free tier • $20/mo Pro",
    autonomy: "Medium",
    categories: ["Workflow Automation", "Personal Productivity"],
    features: ["Browser automations", "Playbooks", "Triggers", "Integrations"],
    rating: 4.0,
    affiliateUrl: "/go/bardeen",
    hasReview: true,
    website: "https://www.bardeen.ai",
    actionLabel: "Try Now",
  },
  {
    slug: "intercom-fin",
    name: "Intercom Fin",
    bestFor: "Customer support agent that deflects tickets and escalates safely",
    pricing: "From $0.99/resolution • Enterprise",
    autonomy: "Medium",
    categories: ["Enterprise"],
    features: ["Support agent", "Escalations", "Knowledge base", "Analytics"],
    rating: 4.2,
    affiliateUrl: "/go/intercom-fin",
    hasReview: true,
    website: "https://www.intercom.com",
    actionLabel: "Get Deal",
  },
  {
    slug: "hubspot-breeze-agents",
    name: "HubSpot Breeze Agents",
    bestFor: "Marketing/sales agents inside HubSpot with CRM-safe actions",
    pricing: "Pro add-on • Usage tiers",
    autonomy: "Medium",
    categories: ["Enterprise"],
    features: ["CRM actions", "Campaign ops", "Lead routing", "Approvals"],
    rating: 4.1,
    affiliateUrl: "/go/hubspot-breeze-agents",
    hasReview: true,
    website: "https://www.hubspot.com",
    actionLabel: "Get Deal",
  },
  {
    slug: "notion-ai-agents",
    name: "Notion AI (Agents)",
    bestFor: "Docs-to-actions for personal and team productivity workflows",
    pricing: "Add-on • From $10/user/mo",
    autonomy: "Low",
    categories: ["Personal Productivity", "Workflow Automation"],
    features: ["Docs actions", "Summaries", "Tasks", "Knowledge search"],
    rating: 4.1,
    affiliateUrl: "/go/notion-ai-agents",
    hasReview: true,
    website: "https://www.notion.so",
    actionLabel: "Try Now",
  },
  {
    slug: "asana-ai-studio",
    name: "Asana AI Studio",
    bestFor: "Project agents that move work forward inside task management",
    pricing: "Business/Enterprise plans",
    autonomy: "Low",
    categories: ["Enterprise", "Personal Productivity"],
    features: ["Task automation", "Approvals", "Status rollups", "Workflows"],
    rating: 4.0,
    affiliateUrl: "/go/asana-ai-studio",
    hasReview: true,
    website: "https://asana.com",
    actionLabel: "Get Deal",
  },
];

function autonomyRank(level: AutonomyLevel) {
  switch (level) {
    case "Low":
      return 1;
    case "Medium":
      return 2;
    case "High":
      return 3;
  }
}

function formatRating(rating: number) {
  return Math.round(rating * 10) / 10;
}

function parseMonthlyPriceValue(pricing: string) {
  // Used only for sorting (best-effort numeric extraction of monthly $ values).
  const normalized = pricing.toLowerCase();
  if (normalized.includes("free")) return 0;

  const matches = pricing.match(/\$([0-9]+(?:\.[0-9]+)?)/g);
  if (!matches || matches.length === 0) return Number.POSITIVE_INFINITY;

  const values = matches
    .map((m) => Number(m.replace("$", "")))
    .filter((v) => Number.isFinite(v));

  if (values.length === 0) return Number.POSITIVE_INFINITY;
  return Math.min(...values);
}

function RatingStars({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2;
  const full = Math.floor(rounded);
  const hasHalf = rounded - full >= 0.5;

  return (
    <div className="inline-flex items-center gap-1" aria-label={`${formatRating(rating)} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const index = i + 1;
        const filled = index <= full;
        const half = !filled && hasHalf && index === full + 1;
        return (
          <span key={i} className="relative inline-flex">
            <Star className={cn("h-4 w-4", filled ? "text-[color:var(--secondary)]" : "text-white/20")} />
            {half ? (
              <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className="h-4 w-4 text-[color:var(--secondary)]" />
              </span>
            ) : null}
          </span>
        );
      })}
      <span className="ml-1 text-xs text-muted-foreground tabular-nums">{formatRating(rating)}</span>
    </div>
  );
}

function LogoMark({ name }: { name: string }) {
  const letter = name.trim().slice(0, 1).toUpperCase();
  const isOrange = name.toLowerCase().includes("microsoft") || name.toLowerCase().includes("zapier");
  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]",
        isOrange ? "bg-[rgba(255,107,0,0.10)]" : "bg-[rgba(0,240,255,0.10)]"
      )}
      aria-hidden
    >
      <span className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
      <span
        className={cn(
          "relative text-sm font-semibold",
          isOrange ? "text-[color:var(--secondary)]" : "text-[color:var(--primary)]"
        )}
      >
        {letter}
      </span>
    </span>
  );
}

export function ComparisonTable({
  variant = "full",
  limit,
  title = "Compare Agentic AI Tools",
  description = "Search, filter, and sort across agentic AI tools with real 2026 pricing and capabilities.",
  initialQuery,
  initialAutonomy,
  initialSelectedCategories,
  extraRows,
  loading = false,
}: {
  variant?: "full" | "compact";
  limit?: number;
  title?: string;
  description?: string;
  initialQuery?: string;
  initialAutonomy?: AutonomyLevel | "All";
  initialSelectedCategories?: ToolCategory[];
  extraRows?: ToolRow[];
  loading?: boolean;
}) {
  const isCompact = variant === "compact";
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "rating", desc: true },
  ]);
  const [query, setQuery] = React.useState(() => initialQuery ?? "");
  const [autonomy, setAutonomy] = React.useState<AutonomyLevel | "All">(
    () => initialAutonomy ?? "All"
  );
  const [selectedCategories, setSelectedCategories] = React.useState<Set<ToolCategory>>(
    () => new Set(initialSelectedCategories ?? [])
  );

  const effectiveLimit = limit ?? (isCompact ? 10 : undefined);

  const rows = React.useMemo(() => {
    const merged = new Map<string, ToolRow>();
    TOOL_ROWS.forEach((r) => merged.set(r.slug, r));
    (extraRows ?? []).forEach((r) => {
      if (!r?.slug) return;
      if (!merged.has(r.slug)) merged.set(r.slug, r);
    });

    const all = Array.from(merged.values());
    const base = isCompact ? [...all].sort((a, b) => b.rating - a.rating) : all;

    const q = query.trim().toLowerCase();
    const selected = selectedCategories;

    const filtered = base.filter((r) => {
      const matchesQuery =
        q.length === 0 ||
        r.name.toLowerCase().includes(q) ||
        r.bestFor.toLowerCase().includes(q) ||
        r.features.join(" ").toLowerCase().includes(q);
      const matchesCategory =
        selected.size === 0 || r.categories.some((c) => selected.has(c));
      const matchesAutonomy = autonomy === "All" || r.autonomy === autonomy;
      return matchesQuery && matchesCategory && matchesAutonomy;
    });

    return effectiveLimit ? filtered.slice(0, effectiveLimit) : filtered;
  }, [query, autonomy, selectedCategories, effectiveLimit, isCompact, extraRows]);

  const columns = React.useMemo<ColumnDef<ToolRow>[]>(
    () => {
      const cols: ColumnDef<ToolRow>[] = [
        {
          accessorKey: "name",
          header: ({ column }) => (
            <button
              className="inline-flex items-center gap-2 text-left font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Tool
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            </button>
          ),
          cell: ({ row }) => {
            const tool = row.original;
            const nameEl = tool.hasReview ? (
              <Link
                href={`/tools/${tool.slug}`}
                className="font-semibold tracking-tight hover:underline"
              >
                {tool.name}
              </Link>
            ) : (
              <span className="font-semibold tracking-tight">{tool.name}</span>
            );

            return (
              <div className="flex items-center gap-3">
                <LogoMark name={tool.name} />
                <div className="min-w-0">
                  {nameEl}
                  {!isCompact ? (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {tool.categories.slice(0, 3).map((c) => (
                        <Badge key={c} variant={c === "Coding Agents" ? "cyan" : "default"}>
                          {c}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          },
        },
      ];

      if (!isCompact) {
        cols.push({
          accessorKey: "categories",
          header: "Category",
          meta: { headerClassName: "hidden lg:table-cell", cellClassName: "hidden lg:table-cell" },
          cell: ({ row }) => (
            <div className="flex flex-wrap gap-1.5">
              {row.original.categories.map((c) => (
                <Badge key={c} variant={c === "Enterprise" ? "orange" : "default"}>
                  {c}
                </Badge>
              ))}
            </div>
          ),
        });
      }

      cols.push(
        {
          accessorKey: "bestFor",
          header: "Best For",
          cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">{row.original.bestFor}</span>
          ),
        },
        {
          accessorKey: "pricing",
          header: ({ column }) => (
            <button
              className="inline-flex items-center gap-2 text-left font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Pricing
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            </button>
          ),
          sortingFn: (a, b) =>
            parseMonthlyPriceValue(a.original.pricing) - parseMonthlyPriceValue(b.original.pricing),
          cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">{row.original.pricing}</span>
          ),
        },
        {
          accessorKey: "autonomy",
          header: ({ column }) => (
            <button
              className="inline-flex items-center gap-2 text-left font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Autonomy
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            </button>
          ),
          sortingFn: (a, b) =>
            autonomyRank(a.original.autonomy) - autonomyRank(b.original.autonomy),
          cell: ({ row }) => {
            const level = row.original.autonomy;
            return (
              <Badge
                variant={level === "High" ? "cyan" : level === "Medium" ? "yellow" : "gray"}
              >
                {level}
              </Badge>
            );
          },
        }
      );

      if (!isCompact) {
        cols.push({
          accessorKey: "features",
          header: "Key Features",
          meta: { headerClassName: "hidden xl:table-cell", cellClassName: "hidden xl:table-cell" },
          cell: ({ row }) => (
            <div className="flex flex-wrap gap-1.5">
              {row.original.features.slice(0, 5).map((i) => (
                <Badge key={i} variant="default">
                  {i}
                </Badge>
              ))}
            </div>
          ),
        });
      }

      cols.push(
        {
          accessorKey: "rating",
          header: ({ column }) => (
            <button
              className="inline-flex items-center gap-2 text-left font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Rating
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            </button>
          ),
          cell: ({ row }) => <RatingStars rating={row.original.rating} />,
        },
        {
          id: "action",
          header: "Action",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Button asChild variant="secondary" size="sm">
                <a
                  href={row.original.affiliateUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  aria-label={`${row.original.actionLabel ?? "Try Now"}: ${row.original.name}`}
                >
                  {row.original.actionLabel ?? "Try Now"}
                </a>
              </Button>
              {row.original.website ? (
                <a
                  href={row.original.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                  aria-label={`Official website for ${row.original.name}`}
                >
                  Site
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              ) : null}
            </div>
          ),
        }
      );

      return cols;
    },
    [isCompact]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const sortedRows = table.getRowModel().rows.map((r) => r.original);

  const headerActions = (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-[320px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, use-cases, features…"
          className="pl-9"
          aria-label="Search tools"
        />
      </div>

      <select
        value={autonomy}
        onChange={(e) => setAutonomy(e.target.value as AutonomyLevel | "All")}
        className="h-11 rounded-xl bg-transparent px-4 text-sm shadow-[inset_0_0_0_1px_var(--color-input)] outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Filter by autonomy level"
      >
        <option value="All">All autonomy</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setQuery("");
          setAutonomy("All");
          setSelectedCategories(new Set());
          setSorting([{ id: "rating", desc: true }]);
        }}
        className="h-11"
      >
        Reset
      </Button>
    </div>
  );

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(0,240,255,0.7),rgba(255,107,0,0.65),transparent)]" />
      <CardHeader className={cn(isCompact ? "pb-4" : undefined)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>

          {!isCompact ? headerActions : null}
        </div>

        {!isCompact ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategories(new Set())}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedCategories.size === 0 ? "bg-white/[0.08] text-foreground" : "bg-white/5 text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={selectedCategories.size === 0}
            >
              All
            </button>
            {ALL_CATEGORIES.map((c) => {
              const active = selectedCategories.has(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedCategories((prev) => {
                      const next = new Set(prev);
                      if (next.has(c)) next.delete(c);
                      else next.add(c);
                      return next;
                    });
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "bg-[rgba(0,240,255,0.14)] text-[color:var(--primary)]" : "bg-white/5 text-muted-foreground hover:text-foreground"
                  )}
                  aria-pressed={active}
                >
                  {c}
                </button>
              );
            })}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="md:hidden">
          {loading ? (
            <div className="grid gap-3">
              {Array.from({ length: Math.min(effectiveLimit ?? 8, 8) }).map((_, i) => (
                <div
                  key={i}
                  className="h-[170px] rounded-[var(--radius)] bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]"
                />
              ))}
            </div>
          ) : sortedRows.length === 0 ? (
            <div className="rounded-[var(--radius)] bg-white/[0.03] p-5 text-sm text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              No tools match your filters. Try broadening your search.
            </div>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {sortedRows.map((tool) => (
                  <motion.div
                    key={tool.slug}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="rounded-[var(--radius)] bg-card/70 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <LogoMark name={tool.name} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {tool.hasReview ? (
                              <Link
                                href={`/tools/${tool.slug}`}
                                className="font-semibold tracking-tight hover:underline"
                              >
                                {tool.name}
                              </Link>
                            ) : (
                              <span className="font-semibold tracking-tight">{tool.name}</span>
                            )}
                            <Badge
                              variant={
                                tool.autonomy === "High"
                                  ? "cyan"
                                  : tool.autonomy === "Medium"
                                    ? "yellow"
                                    : "gray"
                              }
                            >
                              {tool.autonomy}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{tool.bestFor}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <RatingStars rating={tool.rating} />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tool.categories.slice(0, isCompact ? 2 : tool.categories.length).map((c) => (
                        <Badge key={c} variant="default">
                          {c}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-3 text-sm text-muted-foreground">{tool.pricing}</div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tool.features.slice(0, isCompact ? 4 : 6).map((f) => (
                        <Badge key={f} variant="default" className="bg-white/[0.04]">
                          {f}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Button asChild variant="secondary" size="sm">
                        <a href={tool.affiliateUrl} rel="nofollow">
                          {tool.actionLabel ?? "Try Now"}
                        </a>
                      </Button>
                      {tool.website ? (
                        <a
                          href={tool.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                        >
                          Official site
                          <ExternalLink className="h-4 w-4" aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div
          className="relative hidden overflow-x-auto pb-2 md:block"
          tabIndex={0}
          aria-label="Scrollable comparison table"
        >
          {!isCompact ? (
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground xl:hidden">
              <span>Some columns are hidden on smaller screens.</span>
              <span className="font-medium">Scroll →</span>
            </div>
          ) : null}
          <table
            className={cn(
              "w-full border-separate border-spacing-0",
              isCompact ? "min-w-[860px]" : "min-w-[920px] lg:min-w-[1040px] xl:min-w-[1180px]"
            )}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "border-b border-border/60 bg-card/40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                        (header.column.columnDef.meta as ColumnMeta | undefined)?.headerClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: Math.min(effectiveLimit ?? 10, 10) }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: columns.length }).map((__, j) => (
                      <td key={j} className="border-b border-border/50 px-4 py-4 align-top">
                        <div className="h-4 w-full max-w-[220px] rounded bg-white/[0.06]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-10 text-sm text-muted-foreground"
                  >
                    No tools match your filters. Try broadening your search.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group transition-colors hover:bg-white/[0.02]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "border-b border-border/50 px-4 py-4 align-top text-sm",
                          (cell.column.columnDef.meta as ColumnMeta | undefined)?.cellClassName
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!isCompact ? (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background/90 to-transparent xl:hidden"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background/90 to-transparent xl:hidden"
              />
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
