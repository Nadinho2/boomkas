import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SITE_ORIGIN } from "@/lib/seo";

const COUNTRY_REGION_MAP: Record<string, string> = {
  US: "us",
  GB: "uk",
  CA: "ca",
  AU: "au",
  IN: "in",
  SG: "sg",
  NG: "ng",
};

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  return { url, anonKey };
}

type RequestWithGeo = NextRequest & {
  geo?: {
    country?: string;
  };
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD") {
    const url = new URL(request.url);
    const host = url.host.toLowerCase();
    const proto = (request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")).toLowerCase();

    const preferredHost = (() => {
      try {
        return new URL(SITE_ORIGIN).host.toLowerCase();
      } catch {
        return "www.boomkas.com";
      }
    })();
    const alternateHost = preferredHost.startsWith("www.") ? preferredHost.slice(4) : `www.${preferredHost}`;
    const knownHosts = new Set([preferredHost, alternateHost]);

    const lowerPath = pathname.toLowerCase();
    const normalizedPath =
      lowerPath === "/" ? "/" : lowerPath.endsWith("/") ? lowerPath.slice(0, -1) : lowerPath;

    const shouldNormalizeHost = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    const needsHost = shouldNormalizeHost && knownHosts.has(host) && host !== preferredHost;
    const needsHttps = proto !== "https";
    const needsPath = pathname !== normalizedPath;

    if (needsHost || needsHttps || needsPath) {
      const destination = new URL(request.url);
      destination.protocol = "https:";
      destination.host = preferredHost;
      destination.pathname = normalizedPath;
      return NextResponse.redirect(destination, 308);
    }
  }

  // --- GEO TARGETING ---
  const country =
    (request as RequestWithGeo).geo?.country ??
    request.headers.get("x-vercel-ip-country") ??
    "US";
  const region = COUNTRY_REGION_MAP[country] || "us";

  // --- AUTH ---
  const { url, anonKey } = getSupabaseEnv();
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Apply geo headers
  response.headers.set("x-user-region", region);
  response.headers.set("x-user-country", country);

  // Set geo cookie if not already set
  if (!request.cookies.has("boomkas-region")) {
    response.cookies.set("boomkas-region", region, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }

  // Only run auth logic for admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    if (!url || !anonKey) {
      return response;
    }

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (pathname === "/admin/login") {
      if (user) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return response;
    }

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.).*)',
  ],
};
