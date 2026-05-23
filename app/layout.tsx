import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { WebSiteSchema } from "@/components/schema/WebSiteSchema";
import { OrganizationSchema } from "@/components/schema/OrganizationSchema";
import { SITE_ORIGIN, canonicalAlternates, canonicalUrl, generateMetaDescription } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const ROOT_DESCRIPTION = generateMetaDescription({
  description:
    "Discover, compare, and master the best agentic AI tools that plan, reason, and execute workflows autonomously with real 2026 pricing, pros/cons, and reviews.",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Boomkas — Agentic AI Tools Compared (2026)",
    template: "%s — Boomkas",
  },
  description: ROOT_DESCRIPTION,
  applicationName: "Boomkas",
  keywords: [
    "agentic ai",
    "ai agents",
    "automation",
    "workflow",
    "productivity",
    "tool comparison",
    "reviews",
  ],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  alternates: canonicalAlternates("/"),
  openGraph: {
    type: "website",
    url: canonicalUrl("/"),
    title: "Boomkas — Agentic AI Tools Compared (2026)",
    description: ROOT_DESCRIPTION,
    siteName: "Boomkas",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Boomkas — Agentic AI Tools Compared (2026)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boomkas — Agentic AI Tools Compared (2026)",
    description: ROOT_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const rootHref = canonicalUrl("/");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="alternate" hrefLang="en-us" href={rootHref} />
        <link rel="alternate" hrefLang="en-gb" href={rootHref} />
        <link rel="alternate" hrefLang="en-ca" href={rootHref} />
        <link rel="alternate" hrefLang="en-au" href={rootHref} />
        <link rel="alternate" hrefLang="en-in" href={rootHref} />
        <link rel="alternate" hrefLang="en-sg" href={rootHref} />
        <link rel="alternate" hrefLang="x-default" href={rootHref} />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="language" content="English" />
        <WebSiteSchema />
        <OrganizationSchema />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}', { anonymize_ip: true });`}
            </Script>
          </>
        ) : null}

        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/40">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 font-semibold tracking-tight"
              aria-label="Boomkas Home"
            >
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
                <span className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_30%,rgba(0,240,255,0.35),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(255,107,0,0.25),transparent_55%)]" />
                <span className="relative text-xs font-bold">B</span>
              </span>
              <span className="text-base">
                Boom<span className="text-[color:var(--secondary)]">kas</span>
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/tools">Tools</NavLink>
              <NavLink href="/rankings">Rankings</NavLink>
              <NavLink href="/compare">Compare</NavLink>
              <NavLink href="/guides">Guides</NavLink>
              <NavLink href="/blog">Blog</NavLink>
              <NavLink href="/authors">Authors</NavLink>
              <NavLink href="/about">About</NavLink>
            </nav>

            <div className="flex items-center gap-2">
              <form action="/blog" method="get" className="hidden sm:block">
                <label className="sr-only" htmlFor="header-search">
                  Search
                </label>
                <input
                  id="header-search"
                  name="q"
                  placeholder="Search..."
                  className="h-10 w-[220px] rounded-full bg-white/5 px-4 text-sm text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </form>
              <details className="relative sm:hidden">
                <summary className="inline-flex h-10 cursor-pointer list-none items-center justify-center rounded-full bg-white/5 px-4 text-sm font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Menu
                </summary>
                <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
                  <MobileNavLink href="/">Home</MobileNavLink>
                  <MobileNavLink href="/tools">Tools</MobileNavLink>
                  <MobileNavLink href="/rankings">Rankings</MobileNavLink>
                  <MobileNavLink href="/compare">Compare</MobileNavLink>
                  <MobileNavLink href="/guides">Guides</MobileNavLink>
                  <MobileNavLink href="/blog">Blog</MobileNavLink>
                  <MobileNavLink href="/authors">Authors</MobileNavLink>
                  <MobileNavLink href="/about">About</MobileNavLink>
                </div>
              </details>
              <Link
                href="/tools"
                className="inline-flex h-10 items-center justify-center rounded-full bg-white/5 px-4 text-sm font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore
              </Link>
            </div>
          </div>
        </header>

        <main id="content" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border/60 bg-background/50">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Boomkas</span> — premium agentic AI tools comparison & reviews.
              </div>
              <div className="text-xs text-muted-foreground">
                Affiliate disclaimer: links may earn us a commission at no extra cost to you.
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/tools" className="text-muted-foreground hover:text-foreground hover:underline">
                Tools
              </Link>
              <Link href="/rankings" className="text-muted-foreground hover:text-foreground hover:underline">
                Rankings
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground hover:underline">
                Blog
              </Link>
              <Link href="/guides" className="text-muted-foreground hover:text-foreground hover:underline">
                Guides
              </Link>
              <Link href="/compare" className="text-muted-foreground hover:text-foreground hover:underline">
                Compare
              </Link>
              <Link href="/use-cases" className="text-muted-foreground hover:text-foreground hover:underline">
                Use Cases
              </Link>
              <Link href="/alternatives" className="text-muted-foreground hover:text-foreground hover:underline">
                Alternatives
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground hover:underline">
                About
              </Link>
              <Link href="/editorial-guidelines" className="text-muted-foreground hover:text-foreground hover:underline">
                Editorial Guidelines
              </Link>
              <Link href="/review-methodology" className="text-muted-foreground hover:text-foreground hover:underline">
                Review Methodology
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground hover:underline">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground hover:underline">
                Terms
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground hover:underline">
                Contact
              </Link>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex h-6 items-center rounded-full bg-white/5 px-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
                Secure HTTPS
              </span>
              <span>Trust badge</span>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </Link>
  );
}
