import { NextResponse, type NextRequest } from "next/server";

import { getAffiliateLink } from "@/lib/affiliates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const { slug } = await params;
  const entry = getAffiliateLink(slug);

  const fallback = "https://boomkas.com/tools";
  if (!entry) {
    return NextResponse.redirect(fallback, 307);
  }

  const goUrl = `https://boomkas.com/go/${entry.slug}`;
  const destination = entry.hasAffiliate ? entry.url : entry.officialUrl;
  const safeDestination = destination === goUrl ? entry.officialUrl : destination;

  return NextResponse.redirect(safeDestination, 307);
}

