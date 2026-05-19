import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Agentic AI Guides",
  description: "New to AI agents? Start with these.",
  alternates: {
    canonical: "/guides",
    languages: {
      "en-US": "https://boomkas.com/guides",
      "en-GB": "https://boomkas.com/guides",
      "en-CA": "https://boomkas.com/guides",
      "en-AU": "https://boomkas.com/guides",
      "en-IN": "https://boomkas.com/guides",
      "en-SG": "https://boomkas.com/guides",
    },
  },
};

const GUIDES = [
  { slug: "what-is-agentic-ai", title: "What is Agentic AI?", desc: "The definitive primer on autonomous systems.", time: "5 min read", difficulty: "Beginner" },
  { slug: "how-to-choose-ai-agent", title: "How to Choose an AI Agent", desc: "A framework for evaluating tools.", time: "7 min read", difficulty: "Beginner" },
  { slug: "agentic-ai-for-beginners", title: "Agentic AI for Beginners", desc: "Step-by-step introduction to autonomous workflows.", time: "10 min read", difficulty: "Beginner" },
  { slug: "how-to-automate-workflows", title: "How to Automate Workflows", desc: "Connecting agents to your apps.", time: "12 min read", difficulty: "Intermediate" },
  { slug: "multi-agent-systems-explained", title: "Multi-Agent Systems Explained", desc: "When one agent isn't enough.", time: "15 min read", difficulty: "Advanced" },
  { slug: "ai-agents-vs-ai-assistants", title: "AI Agents vs AI Assistants", desc: "Understanding the crucial difference.", time: "6 min read", difficulty: "Beginner" },
];

export default function GuidesIndexPage() {
  const featured = GUIDES[0];
  const remaining = GUIDES.slice(1);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Agentic AI Guides
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
          New to AI agents? Start with these.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-sm font-medium tracking-wide text-primary uppercase mb-4">Start Here</h2>
        <Card className="flex flex-col sm:flex-row overflow-hidden border-primary/20 bg-primary/5">
          <div className="sm:w-1/3 bg-muted hidden sm:block"></div>
          <div className="flex-1">
            <CardHeader>
              <div className="flex gap-2 mb-3">
                <Badge variant="cyan">{featured.difficulty}</Badge>
                <span className="text-xs text-muted-foreground flex items-center">{featured.time}</span>
              </div>
              <CardTitle className="text-2xl">{featured.title}</CardTitle>
              <CardDescription className="text-base mt-2">{featured.desc}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href={`/guides/${featured.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Read guide →
              </Link>
            </CardFooter>
          </div>
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
    </div>
  );
}
