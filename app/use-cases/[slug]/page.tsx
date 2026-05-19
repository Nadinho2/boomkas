import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const useCase = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `Best AI Agents for ${useCase} in 2026`,
    description: `Discover the top AI tools for ${useCase.toLowerCase()}. Read reviews and compare features.`,
    alternates: {
      canonical: `/use-cases/${slug}`,
      languages: {
        "en-US": `https://boomkas.com/use-cases/${slug}`,
        "en-GB": `https://boomkas.com/use-cases/${slug}`,
        "en-CA": `https://boomkas.com/use-cases/${slug}`,
        "en-AU": `https://boomkas.com/use-cases/${slug}`,
        "en-IN": `https://boomkas.com/use-cases/${slug}`,
        "en-SG": `https://boomkas.com/use-cases/${slug}`,
      },
    },
  };
}

export default async function UseCaseSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const tools = [
    { name: "Top Pick Tool", rating: 4.9, pricing: "Free / $20/mo", desc: "The absolute best choice for this category.", slug: "top-pick-tool" },
    { name: "Runner Up", rating: 4.7, pricing: "$15/mo", desc: "A strong alternative with unique features.", slug: "runner-up" },
    { name: "Budget Option", rating: 4.5, pricing: "Free forever", desc: "Great for individuals and small teams.", slug: "budget-option" },
    { name: "Enterprise Choice", rating: 4.8, pricing: "Contact sales", desc: "For large organizations needing SOC2.", slug: "enterprise-choice" },
    { name: "Open Source Alternative", rating: 4.6, pricing: "Free", desc: "Self-hostable and highly customizable.", slug: "open-source" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">
        Best AI Agents for {useCase} in 2026
      </h1>
      <p className="text-lg text-muted-foreground leading-7 mb-12">
        If you are looking to automate your workflow, save time, or build faster, these are the absolute best tools in the {useCase.toLowerCase()} category right now.
      </p>

      <div className="space-y-6 mb-16">
        {tools.map((tool, index) => (
          <Card key={tool.slug} className="border-border/60">
            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">#{index + 1}</span>
                  <h3 className="text-xl font-semibold">{tool.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-3">{tool.desc}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div>⭐ {tool.rating}/5</div>
                  <div>💰 {tool.pricing}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[150px]">
                <Button asChild variant="primary" className="w-full">
                  <a
                    href={`/go/${tool.slug}`}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Get {tool.name}
                  </a>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href={`/tools/${tool.slug}`}>View full review →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-12 bg-card border border-border/50 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6">How to choose the right tool</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-2">1. Consider your technical expertise</h3>
            <p className="text-muted-foreground">Some tools require coding knowledge, while others are purely drag-and-drop or prompt-based.</p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">2. Evaluate your budget</h3>
            <p className="text-muted-foreground">Many offer generous free tiers, but costs can scale quickly as your usage increases.</p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">3. Check integrations</h3>
            <p className="text-muted-foreground">Ensure the agent can seamlessly connect with the software you already use daily.</p>
          </div>
        </div>
      </div>

      <div className="text-center bg-primary/5 border border-primary/20 rounded-2xl p-10">
        <h2 className="text-2xl font-semibold mb-4">Still not sure?</h2>
        <p className="text-muted-foreground mb-6">See how the top two tools stack up against each other in our deep-dive comparison.</p>
        <Button asChild variant="secondary" size="lg">
          <Link href="/compare/top-pick-vs-runner-up">Compare top picks →</Link>
        </Button>
      </div>
    </div>
  );
}
