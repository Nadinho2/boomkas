import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTHORS, getAuthorBySlug } from "@/lib/authors";
import { canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

async function getPublishedPostsByAuthorName(name: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("posts")
      .select("slug,title,excerpt,published_at,updated_at,created_at,status")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(200);

    const rows = (data as Array<Record<string, unknown>> | null) ?? [];
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
    const authorKey = normalize(name);

    return rows
      .map((r) => {
        const slug = typeof r.slug === "string" ? r.slug : "";
        if (!slug) return null;
        const title = typeof r.title === "string" ? r.title : "Untitled";
        const excerpt = typeof r.excerpt === "string" ? r.excerpt : "";
        const dateISO =
          (typeof r.published_at === "string" ? r.published_at : undefined) ??
          (typeof r.updated_at === "string" ? r.updated_at : undefined) ??
          (typeof r.created_at === "string" ? r.created_at : undefined);

        const contentBlob = normalize([title, excerpt].join(" "));
        const looksAuthored =
          contentBlob.includes(authorKey) ||
          title.toLowerCase().includes("boomkas") ||
          authorKey.includes("boomkas");

        if (!looksAuthored) return null;

        return { slug, title, excerpt, dateISO: dateISO ?? undefined };
      })
      .filter(
        (x): x is { slug: string; title: string; excerpt: string; dateISO: string | undefined } => !!x
      )
      .slice(0, 30);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};

  const title = `${author.name} — Author Profile`;
  const description = generateMetaDescription({
    title,
    description: `${author.name} writes and tests AI tools for Boomkas. Credentials, expertise areas, and published articles.`,
  });

  return {
    title,
    description,
    alternates: canonicalAlternates(`/authors/${author.slug}`),
    openGraph: {
      title,
      description,
      url: canonicalUrl(`/authors/${author.slug}`),
      type: "profile",
      images: [{ url: "https://boomkas.com/og.png", alt: "Boomkas" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://boomkas.com/og.png"],
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const url = canonicalUrl(`/authors/${author.slug}`);
  const posts = await getPublishedPostsByAuthorName(author.name);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url,
    jobTitle: author.role,
    image: author.photoDataUri,
    sameAs: author.socials.map((s) => s.url),
    worksFor: { "@type": "Organization", name: "Boomkas", url: canonicalUrl("/") },
    knowsAbout: author.expertise,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Authors", url: canonicalUrl("/authors") },
          { name: author.name, url },
        ]}
      />

      <section className="relative overflow-hidden rounded-[var(--radius)] bg-card/60 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,240,255,0.16),transparent_58%),radial-gradient(circle_at_80%_70%,rgba(255,107,0,0.12),transparent_58%)]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
            <Image src={author.photoDataUri} alt={`${author.name} photo`} fill sizes="96px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan">Author</Badge>
              <Badge variant="default">Tested</Badge>
              <Badge variant="default">Updated</Badge>
            </div>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              {author.name}
            </h1>
            <p className="mt-3 max-w-3xl text-pretty text-sm leading-7 text-muted-foreground sm:text-lg">
              {author.role}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle>Bio</CardTitle>
            <CardDescription>Credentials, scope, and what we test.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>{author.bio}</p>
            <div>
              <div className="text-sm font-semibold text-foreground">Credentials</div>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {author.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Areas of expertise</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {author.expertise.map((e) => (
                  <Badge key={e} variant="default">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>Reach out with corrections or press inquiries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <a href={`mailto:${author.email}`} className="font-medium text-[color:var(--primary)] hover:underline">
                  {author.email}
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {author.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/40">
            <CardHeader>
              <CardTitle>Published articles</CardTitle>
              <CardDescription>Recent posts by this author.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {posts.length ? (
                <ul className="space-y-3">
                  {posts.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`} className="text-sm font-semibold hover:underline">
                        {p.title}
                      </Link>
                      {p.excerpt ? <div className="mt-1 text-xs text-muted-foreground">{p.excerpt}</div> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">No published posts found yet.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
