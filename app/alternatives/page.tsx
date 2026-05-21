import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best Alternatives to Popular Agentic AI Tools",
  description: generateMetaDescription({
    title: "Best Alternatives to Popular Agentic AI Tools",
    description:
      "Already using a tool and looking for something better? Explore curated alternatives with pricing, key differences, and guidance on which option fits your workflow best.",
  }),
  alternates: {
    ...canonicalAlternates("/alternatives"),
    languages: {
      "en-US": "https://boomkas.com/alternatives",
      "en-GB": "https://boomkas.com/alternatives",
      "en-CA": "https://boomkas.com/alternatives",
      "en-AU": "https://boomkas.com/alternatives",
      "en-IN": "https://boomkas.com/alternatives",
      "en-SG": "https://boomkas.com/alternatives",
    },
  },
  openGraph: {
    title: "Best Alternatives to Popular Agentic AI Tools",
    description: generateMetaDescription({
      title: "Best Alternatives to Popular Agentic AI Tools",
      description:
        "Already using a tool and looking for something better? Explore curated alternatives with pricing, key differences, and guidance on which option fits your workflow best.",
    }),
    url: canonicalUrl("/alternatives"),
    type: "website",
    images: [{ url: "https://boomkas.com/og.png", alt: "Boomkas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Alternatives to Popular Agentic AI Tools",
    description: generateMetaDescription({
      title: "Best Alternatives to Popular Agentic AI Tools",
      description:
        "Already using a tool and looking for something better? Explore curated alternatives with pricing, key differences, and guidance on which option fits your workflow best.",
    }),
    images: ["https://boomkas.com/og.png"],
  },
};

const ALTERNATIVES = [
  { slug: "zapier", name: "Zapier", count: 7, category: "Workflow Automation" },
  { slug: "cursor", name: "Cursor", count: 5, category: "Coding Agents" },
  { slug: "make", name: "Make", count: 6, category: "Workflow Automation" },
  { slug: "github-copilot", name: "GitHub Copilot", count: 8, category: "Coding Agents" },
  { slug: "notion-ai", name: "Notion AI", count: 4, category: "Personal Productivity" },
  { slug: "devin", name: "Devin", count: 3, category: "Coding Agents" },
  { slug: "n8n", name: "n8n", count: 5, category: "Workflow Automation" },
  { slug: "copilot-studio", name: "Copilot Studio", count: 4, category: "Enterprise" },
];

export default function AlternativesIndexPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Alternatives", url: canonicalUrl("/alternatives") },
        ]}
      />
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Best Alternatives to Popular Agentic AI Tools
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
          Already using a tool and looking for something better? Start here.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ALTERNATIVES.map((alt) => (
          <Card key={alt.slug} className="flex flex-col">
            <CardHeader>
              <div className="mb-3">
                <Badge variant="cyan">{alt.category}</Badge>
              </div>
              <CardTitle>Best alternatives to {alt.name}</CardTitle>
              <CardDescription className="mt-2">{alt.count} alternatives covered</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link
                href={`/alternatives/${alt.slug}`}
                className="text-sm font-medium text-secondary hover:underline"
              >
                See alternatives →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
