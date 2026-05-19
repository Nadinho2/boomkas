import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | Agentic AI Guide`,
    description: `Learn everything about ${title.toLowerCase()} in this comprehensive guide.`,
    alternates: {
      canonical: `/guides/${slug}`,
      languages: {
        "en-US": `https://boomkas.com/guides/${slug}`,
        "en-GB": `https://boomkas.com/guides/${slug}`,
        "en-CA": `https://boomkas.com/guides/${slug}`,
        "en-AU": `https://boomkas.com/guides/${slug}`,
        "en-IN": `https://boomkas.com/guides/${slug}`,
        "en-SG": `https://boomkas.com/guides/${slug}`,
      },
    },
  };
}

export default async function GuidesSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="cyan">Beginner</Badge>
          <span className="text-sm text-muted-foreground">8 min read</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          {title}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* TOC Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="sticky top-24">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Table of Contents</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#section-1" className="text-muted-foreground hover:text-foreground">1. Introduction to the topic</a></li>
              <li><a href="#section-2" className="text-muted-foreground hover:text-foreground">2. Core concepts explained</a></li>
              <li><a href="#section-3" className="text-muted-foreground hover:text-foreground">3. Step-by-step tutorial</a></li>
              <li><a href="#section-4" className="text-muted-foreground hover:text-foreground">4. Common pitfalls</a></li>
              <li><a href="#section-5" className="text-muted-foreground hover:text-foreground">5. Next steps and resources</a></li>
            </ul>
          </div>
        </div>

        {/* Content */}
        <article className="flex-1 prose prose-invert max-w-none prose-a:text-primary">
          <p className="lead text-xl text-muted-foreground mb-10">
            Welcome to this comprehensive guide on {title.toLowerCase()}. In this article, we&apos;ll break down exactly what you need to know to get started and succeed.
          </p>

          <h2 id="section-1" className="text-2xl font-semibold mt-12 mb-6">1. Introduction to the topic</h2>
          <p className="mb-6 leading-7">This is placeholder text for the first section. You&apos;ll learn the foundations of what makes this so important in the modern era of agentic AI. We see companies adopting this at a rapid pace.</p>

          <h2 id="section-2" className="text-2xl font-semibold mt-12 mb-6">2. Core concepts explained</h2>
          <p className="mb-6 leading-7">Understanding the fundamentals is key. In this section, we break down the complex jargon into simple, actionable mental models that you can apply immediately.</p>

          <h2 id="section-3" className="text-2xl font-semibold mt-12 mb-6">3. Step-by-step tutorial</h2>
          <p className="mb-6 leading-7">Let&apos;s get practical. Here is how you can implement this yourself today without needing a PhD in computer science or a massive budget.</p>

          <h2 id="section-4" className="text-2xl font-semibold mt-12 mb-6">4. Common pitfalls</h2>
          <p className="mb-6 leading-7">Avoid these mistakes that 90% of beginners make when they first try to implement this workflow.</p>

          <h2 id="section-5" className="text-2xl font-semibold mt-12 mb-6">5. Next steps and resources</h2>
          <p className="mb-6 leading-7">Now that you&apos;ve mastered the basics, here is where you should go next to continue your journey into autonomous systems.</p>
        </article>
      </div>

      <hr className="my-16 border-border/60" />

      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Related tools</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Placeholder Tool {i}</h3>
                <p className="text-sm text-muted-foreground mb-4">A brief description of this related tool.</p>
                <Link href={`/tools/placeholder-${i}`} className="text-primary text-sm font-medium hover:underline">
                  View tool →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Related comparisons</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Tool A vs Tool B</h3>
                <Link href={`/compare/tool-a-vs-tool-b-${i}`} className="text-secondary text-sm font-medium hover:underline">
                  Read comparison →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
