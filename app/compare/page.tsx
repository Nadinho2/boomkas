import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Agentic AI Tool Comparisons",
  description: "Side-by-side breakdowns to help you pick the right tool.",
  alternates: {
    canonical: "/compare",
    languages: {
      "en-US": "https://boomkas.com/compare",
      "en-GB": "https://boomkas.com/compare",
      "en-CA": "https://boomkas.com/compare",
      "en-AU": "https://boomkas.com/compare",
      "en-IN": "https://boomkas.com/compare",
      "en-SG": "https://boomkas.com/compare",
    },
  },
  openGraph: {
    title: "Agentic AI Tool Comparisons",
    description: "Side-by-side breakdowns to help you pick the right tool.",
  },
};

const COMPARISONS = [
  { slug: "cursor-vs-windsurf", title: "Cursor vs Windsurf", desc: "The ultimate showdown for AI coding.", category: "Coding Agents" },
  { slug: "n8n-vs-make", title: "n8n vs Make", desc: "Which automation platform is better for AI?", category: "Workflow Automation" },
  { slug: "cursor-vs-github-copilot", title: "Cursor vs GitHub Copilot", desc: "Is Cursor the Copilot killer?", category: "Coding Agents" },
  { slug: "zapier-vs-make", title: "Zapier vs Make", desc: "The classic no-code automation battle.", category: "Workflow Automation" },
  { slug: "lovable-vs-bolt", title: "Lovable vs Bolt", desc: "Full-stack AI generation compared.", category: "No-Code Builders" },
  { slug: "crewai-vs-autogen", title: "CrewAI vs AutoGen", desc: "Building multi-agent orchestrations.", category: "Multi-Agent" },
  { slug: "devin-vs-cursor", title: "Devin vs Cursor", desc: "Fully autonomous vs co-pilot.", category: "Coding Agents" },
  { slug: "cursor-vs-copilot-studio", title: "Cursor vs Copilot Studio", desc: "Enterprise vs developer-first.", category: "Enterprise" },
];

export default function CompareIndexPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Agentic AI Tool Comparisons
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
          Side-by-side breakdowns to help you pick the right tool
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COMPARISONS.map((comp) => (
          <Card key={comp.slug} className="flex flex-col">
            <CardHeader>
              <div className="mb-3">
                <Badge variant="cyan">{comp.category}</Badge>
              </div>
              <CardTitle>{comp.title}</CardTitle>
              <CardDescription className="mt-2">{comp.desc}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link
                href={`/compare/${comp.slug}`}
                className="text-sm font-medium text-secondary hover:underline"
              >
                Read comparison →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
