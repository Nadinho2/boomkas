import { NextResponse, type NextRequest } from "next/server";

import { getAffiliateLink } from "@/lib/affiliates";
import { SITE_ORIGIN } from "@/lib/seo";

function safeHttpUrl(input: string) {
  try {
    const url = new URL(input);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function stripWww(host: string) {
  const lower = host.toLowerCase();
  return lower.startsWith("www.") ? lower.slice(4) : lower;
}

function isSameGoUrl(a: string, b: string) {
  try {
    const ua = new URL(a);
    const ub = new URL(b);
    return stripWww(ua.host) === stripWww(ub.host) && ua.pathname === ub.pathname;
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const fallback = `${SITE_ORIGIN}/tools`;

  try {
    const { slug } = await params;
    const entry = getAffiliateLink(slug);

    if (!entry) {
      return NextResponse.redirect(fallback, 307);
    }

    const goUrl = `${SITE_ORIGIN}/go/${entry.slug}`;
    const primary = entry.hasAffiliate ? entry.url : entry.officialUrl;

    const resolvedPrimary = safeHttpUrl(primary);
    const resolvedOfficial = safeHttpUrl(entry.officialUrl);

    const resolved = resolvedPrimary ?? resolvedOfficial ?? fallback;
    const finalDestination = isSameGoUrl(resolved, goUrl) ? resolvedOfficial ?? fallback : resolved;

    return NextResponse.redirect(finalDestination, 307);
  } catch {
    return NextResponse.redirect(fallback, 307);
  }
}
