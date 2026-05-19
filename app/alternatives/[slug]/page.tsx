import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const toolName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `Best ${toolName} Alternatives in 2026`,
    description: `Discover the best alternatives to ${toolName} for your specific needs.`,
    alternates: {
      canonical: `/alternatives/${slug}`,
      languages: {
        "en-US": `https://boomkas.com/alternatives/${slug}`,
        "en-GB": `https://boomkas.com/alternatives/${slug}`,
        "en-CA": `https://boomkas.com/alternatives/${slug}`,
        "en-AU": `https://boomkas.com/alternatives/${slug}`,
        "en-IN": `https://boomkas.com/alternatives/${slug}`,
        "en-SG": `https://boomkas.com/alternatives/${slug}`,
      },
    },
  };
}

export default async function AlternativesSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const toolName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  const alternativesList = [
    { name: "Alternative One", desc: "Best overall replacement with more features.", bestFor: "Power users", pricing: "From $20/mo", slug: "alt-one" },
    { name: "Alternative Two", desc: "The budget-friendly open source option.", bestFor: "Indie hackers", pricing: "Free / $10/mo", slug: "alt-two" },
    { name: "Alternative Three", desc: "Enterprise-grade security and compliance.", bestFor: "Large teams", pricing: "Custom", slug: "alt-three" },
    { name: "Alternative Four", desc: "Simplest learning curve for beginners.", bestFor: "Non-technical founders", pricing: "$15/mo", slug: "alt-four" },
    { name: "Alternative Five", desc: "AI-first platform built for modern workflows.", bestFor: "AI native teams", pricing: "$30/mo", slug: "alt-five" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">
        Best {toolName} Alternatives in 2026
      </h1>
      <p className="text-lg text-muted-foreground leading-7 mb-12">
        While {toolName} is a popular choice, it's not the only option. Whether you are looking for better pricing, more advanced features, or an easier interface, these are the top alternatives you should consider switching to this year.
      </p>

      <div className="space-y-8 mb-16">
        {alternativesList.map((alt, index) => (
          <Card key={alt.slug} className="flex flex-col sm:flex-row overflow-hidden border-border/60">
            <div className="bg-primary/10 text-primary w-full sm:w-16 flex items-center justify-center p-4 sm:p-0 font-bold text-2xl">
              #{index + 1}
            </div>
            <CardContent className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">{alt.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{alt.desc}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <div><span className="font-medium text-foreground">Best for:</span> <span className="text-muted-foreground">{alt.bestFor}</span></div>
                  <div><span className="font-medium text-foreground">Pricing:</span> <span className="text-muted-foreground">{alt.pricing}</span></div>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[140px]">
                <Button asChild variant="primary" className="w-full">
                  <a
                    href={`/go/${alt.slug}`}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Visit Site
                  </a>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href={`/tools/${alt.slug}`}>View full review →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-6">Comparison Summary</h2>
      <div className="mb-16 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-4 px-4 font-semibold">Tool</th>
              <th className="py-4 px-4 font-semibold">Best For</th>
              <th className="py-4 px-4 font-semibold">Pricing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {alternativesList.map((alt) => (
              <tr key={alt.slug}>
                <td className="py-4 px-4 font-medium text-primary">{alt.name}</td>
                <td className="py-4 px-4 text-muted-foreground">{alt.bestFor}</td>
                <td className="py-4 px-4 text-muted-foreground">{alt.pricing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-border/60 pb-6">
            <h3 className="font-medium mb-2 text-lg">Why should I switch from {toolName}?</h3>
            <p className="text-muted-foreground">Most users switch due to pricing increases, need for advanced features, or seeking a more intuitive user interface tailored for their specific workflow.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
