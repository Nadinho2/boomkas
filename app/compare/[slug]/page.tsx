import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} Comparison`,
    description: `Detailed comparison for ${slug}.`,
    alternates: {
      canonical: `/compare/${slug}`,
      languages: {
        "en-US": `https://boomkas.com/compare/${slug}`,
        "en-GB": `https://boomkas.com/compare/${slug}`,
        "en-CA": `https://boomkas.com/compare/${slug}`,
        "en-AU": `https://boomkas.com/compare/${slug}`,
        "en-IN": `https://boomkas.com/compare/${slug}`,
        "en-SG": `https://boomkas.com/compare/${slug}`,
      },
    },
  };
}

export default async function CompareSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const toolA = "Tool A";
  const toolB = "Tool B";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-center mb-8">
        {toolA} vs {toolB}: Which Is Better in 2026?
      </h1>

      <div className="flex items-center justify-center gap-4 mb-10 text-xl font-bold">
        <span className="text-primary">{toolA}</span>
        <span className="text-muted-foreground font-normal">vs</span>
        <span className="text-secondary">{toolB}</span>
      </div>

      <Card className="mb-10 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>The Verdict</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Both tools are excellent, but {toolA} wins for developer experience while {toolB} is better for non-technical users. Choose based on your team's background.
          </p>
        </CardContent>
      </Card>

      <div className="mb-12 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-4 px-4 font-semibold">Feature</th>
              <th className="py-4 px-4 font-semibold">{toolA}</th>
              <th className="py-4 px-4 font-semibold">{toolB}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {["Best for", "Pricing", "Autonomy level", "Learning curve", "Integrations", "Free tier", "Rating"].map((row) => (
              <tr key={row}>
                <td className="py-4 px-4 text-muted-foreground">{row}</td>
                <td className="py-4 px-4">Value for {toolA}</td>
                <td className="py-4 px-4">Value for {toolB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">When to choose {toolA}</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>You need advanced customization</li>
            <li>Your team is highly technical</li>
            <li>You prefer open-source integrations</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">When to choose {toolB}</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>You need a plug-and-play solution</li>
            <li>Your team includes non-developers</li>
            <li>You rely on enterprise SaaS tools</li>
          </ul>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our verdict</h2>
        <p className="text-muted-foreground leading-7">
          Ultimately, the choice between these two platforms comes down to your primary use case. If you need deep technical control and don't mind a steeper learning curve, {toolA} is the way to go. If you prioritize ease of use and rapid deployment, {toolB} will serve you better.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Button asChild className="w-full sm:w-auto" variant="primary">
          <a href={`#affiliate-${toolA.toLowerCase().replace(/\s/g, '-')}`}>Get {toolA}</a>
        </Button>
        <Button asChild className="w-full sm:w-auto" variant="ghost">
          <a href={`#affiliate-${toolB.toLowerCase().replace(/\s/g, '-')}`}>Get {toolB}</a>
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Related comparisons</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Link key={i} href={`/compare/related-${i}`} className="p-4 rounded-xl border border-border hover:bg-white/5 transition block">
              <h3 className="font-medium text-primary">Related vs Other</h3>
              <p className="text-sm text-muted-foreground mt-1">Read comparison →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
