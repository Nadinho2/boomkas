import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Find the Right AI Agent for Your Use Case",
  description: "Browse the best agentic AI tools by category, from coding to workflow automation.",
  alternates: {
    canonical: "/use-cases",
    languages: {
      "en-US": "https://boomkas.com/use-cases",
      "en-GB": "https://boomkas.com/use-cases",
      "en-CA": "https://boomkas.com/use-cases",
      "en-AU": "https://boomkas.com/use-cases",
      "en-IN": "https://boomkas.com/use-cases",
      "en-SG": "https://boomkas.com/use-cases",
    },
  },
};

const CATEGORIES = [
  { slug: "coding-agents", name: "Coding Agents", desc: "Autonomous software engineers.", count: 12, tools: ["Cursor", "Windsurf", "Devin"] },
  { slug: "workflow-automation", name: "Workflow Automation", desc: "Connect apps and run processes.", count: 15, tools: ["n8n", "Make", "Zapier"] },
  { slug: "multi-agent-systems", name: "Multi-Agent Systems", desc: "Swarms of agents working together.", count: 8, tools: ["CrewAI", "AutoGen", "LangGraph"] },
  { slug: "no-code-builders", name: "No-Code Builders", desc: "Build full apps via natural language.", count: 10, tools: ["Lovable", "Bolt", "v0"] },
  { slug: "personal-productivity", name: "Personal Productivity", desc: "Your personal autonomous assistant.", count: 18, tools: ["Notion AI", "Mem", "Sana"] },
  { slug: "enterprise", name: "Enterprise", desc: "Secure, scalable AI for large teams.", count: 7, tools: ["Copilot Studio", "Glean", "Cohere"] },
  { slug: "ide-agents", name: "IDE Agents", desc: "Extensions inside your editor.", count: 9, tools: ["GitHub Copilot", "Supermaven", "Cody"] },
];

export default function UseCasesIndexPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Find the Right AI Agent for Your Use Case
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
          Browse the best tools organized by the problems they solve.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <Card key={cat.slug} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-3">
                <Badge variant="cyan">{cat.count} tools</Badge>
              </div>
              <CardTitle className="text-xl">{cat.name}</CardTitle>
              <CardDescription className="mt-2">{cat.desc}</CardDescription>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {cat.tools.map(tool => (
                  <span key={tool} className="text-xs bg-white/5 border border-white/10 rounded-md px-2 py-1 text-muted-foreground">
                    {tool}
                  </span>
                ))}
              </div>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link
                href={`/use-cases/${cat.slug}`}
                className="text-sm font-medium text-secondary hover:underline"
              >
                Explore tools →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
