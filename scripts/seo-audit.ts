type AuditResult = {
  url: string;
  finalUrl: string;
  status: number;
  redirectHops: number;
  canonical?: string;
  canonicalStatus?: number;
  canonicalRedirectTo?: string;
  metaDescriptionLength?: number;
  hasBreadcrumbSchema?: boolean;
  hasValidArticleSchema?: boolean;
  internalNofollowCount?: number;
};

function env(name: string) {
  const v = process.env[name];
  return v && v.length ? v : undefined;
}

function baseUrl() {
  const raw = env("SEO_AUDIT_BASE_URL") ?? "https://www.boomkas.com";
  return new URL(raw).origin;
}

function normalizeUrl(input: string, base: string) {
  try {
    return new URL(input, base).toString();
  } catch {
    return input;
  }
}

function stripWww(host: string) {
  const lower = host.toLowerCase();
  return lower.startsWith("www.") ? lower.slice(4) : lower;
}

function comparableUrl(input: string) {
  try {
    const u = new URL(input);
    const pathname = u.pathname === "/" ? "/" : u.pathname.replace(/\/+$/, "");
    return { hostKey: stripWww(u.host), pathname, search: u.search };
  } catch {
    return null;
  }
}

function isHostAliasRedirect(fromUrl: string, toUrl: string) {
  const a = comparableUrl(fromUrl);
  const b = comparableUrl(toUrl);
  if (!a || !b) return false;
  return a.hostKey === b.hostKey && a.pathname === b.pathname && a.search === b.search;
}

async function fetchWithRedirects(inputUrl: string, maxHops = 10) {
  let current = inputUrl;
  let hops = 0;
  while (hops <= maxHops) {
    const res = await fetch(current, {
      redirect: "manual",
      headers: { "user-agent": "BoomkasSEOAudit/1.0" },
    });

    const status = res.status;
    if (status >= 300 && status < 400) {
      const location = res.headers.get("location");
      if (!location) return { finalUrl: current, status, hops, html: "" };
      current = normalizeUrl(location, current);
      hops += 1;
      continue;
    }

    const html = status === 200 ? await res.text() : "";
    return { finalUrl: current, status, hops, html };
  }
  return { finalUrl: current, status: 0, hops: maxHops + 1, html: "" };
}

function extractCanonical(html: string, base: string) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) return undefined;
  const tag = m[0];
  const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
  if (!href) return undefined;
  return normalizeUrl(href, base);
}

function extractMetaDescription(html: string) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]*>/i);
  if (!m) return undefined;
  const tag = m[0];
  const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
  return content?.trim();
}

function extractJsonLd(html: string) {
  const scripts: unknown[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = (m[1] ?? "").trim();
    if (!raw) continue;
    try {
      scripts.push(JSON.parse(raw));
    } catch {
      scripts.push({ __parseError: true });
    }
  }
  return scripts;
}

function hasBreadcrumbSchema(jsonLd: unknown[]) {
  return jsonLd.some((x) => {
    if (!x || typeof x !== "object") return false;
    const t = (x as { ["@type"]?: unknown })["@type"];
    return t === "BreadcrumbList";
  });
}

function hasValidArticleSchema(jsonLd: unknown[]) {
  const required = [
    "headline",
    "description",
    "datePublished",
    "dateModified",
    "author",
    "publisher",
    "image",
    "url",
    "mainEntityOfPage",
  ];
  return jsonLd.some((x) => {
    if (!x || typeof x !== "object") return false;
    const o = x as Record<string, unknown>;
    if (o["@type"] !== "Article") return false;
    if (!required.every((k) => k in o)) return false;
    const author = o.author as Record<string, unknown> | undefined;
    const publisher = o.publisher as Record<string, unknown> | undefined;
    const image = o.image as Record<string, unknown> | undefined;
    const publisherLogo = publisher?.logo as Record<string, unknown> | undefined;
    return (
      author?.["@type"] === "Person" &&
      typeof author?.name === "string" &&
      publisher?.["@type"] === "Organization" &&
      typeof publisher?.name === "string" &&
      publisherLogo?.["@type"] === "ImageObject" &&
      typeof publisherLogo?.url === "string" &&
      typeof publisherLogo?.width === "number" &&
      typeof publisherLogo?.height === "number" &&
      image?.["@type"] === "ImageObject" &&
      typeof image?.url === "string" &&
      typeof image?.width === "number" &&
      typeof image?.height === "number"
    );
  });
}

function countInternalNofollow(html: string, base: string) {
  const baseOrigin = new URL(base).origin;
  const baseHostKey = stripWww(new URL(baseOrigin).host);
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  let count = 0;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const rawHref = m[1] ?? "";
    const href = normalizeUrl(rawHref, baseOrigin);
    const isInternal = (() => {
      if (rawHref.startsWith("/")) return true;
      try {
        return stripWww(new URL(href).host) === baseHostKey;
      } catch {
        return false;
      }
    })();
    if (!isInternal) continue;
    const rel = tag.match(/rel=["']([^"']+)["']/i)?.[1] ?? "";
    if (/\bnofollow\b/i.test(rel)) count += 1;
  }
  return count;
}

async function run() {
  const base = baseUrl();
  const shouldRun = process.env.VERCEL_ENV === "production" || env("RUN_SEO_AUDIT") === "1";
  if (!shouldRun) {
    console.log("seo-audit: skipping (not production)");
    return;
  }

  const sitemapUrl = `${base}/sitemap.xml`;
  const xml = await fetch(sitemapUrl, { headers: { "user-agent": "BoomkasSEOAudit/1.0" } }).then((r) => r.text());
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => (m[1] ?? "").trim());
  const urls = Array.from(new Set(locs)).filter(Boolean);

  const concurrency = Math.max(1, Number(env("SEO_AUDIT_CONCURRENCY") ?? "8") || 8);
  const maxUrls = Math.max(1, Number(env("SEO_AUDIT_MAX_URLS") ?? String(urls.length)) || urls.length);
  const target = urls.slice(0, maxUrls);

  const results: AuditResult[] = [];
  let idx = 0;
  const workers = Array.from({ length: concurrency }).map(async () => {
    while (idx < target.length) {
      const i = idx++;
      const url = target[i]!;
      const fetched = await fetchWithRedirects(url);
      const canonical = fetched.html ? extractCanonical(fetched.html, fetched.finalUrl) : undefined;
      const metaDescription = fetched.html ? extractMetaDescription(fetched.html) : undefined;
      const jsonLd = fetched.html ? extractJsonLd(fetched.html) : [];
      const internalNofollowCount = fetched.html ? countInternalNofollow(fetched.html, base) : undefined;

      let canonicalStatus: number | undefined;
      let canonicalRedirectTo: string | undefined;
      if (canonical) {
        try {
          const res = await fetch(canonical, { method: "HEAD", redirect: "manual" });
          canonicalStatus = res.status;
          const location = res.headers.get("location");
          canonicalRedirectTo = location ? normalizeUrl(location, canonical) : undefined;
        } catch {
          canonicalStatus = 0;
        }
      }

      results.push({
        url,
        finalUrl: fetched.finalUrl,
        status: fetched.status,
        redirectHops: fetched.hops,
        canonical,
        canonicalStatus,
        canonicalRedirectTo,
        metaDescriptionLength: metaDescription ? metaDescription.length : undefined,
        hasBreadcrumbSchema: hasBreadcrumbSchema(jsonLd),
        hasValidArticleSchema: url.includes("/blog/") ? hasValidArticleSchema(jsonLd) : undefined,
        internalNofollowCount,
      });
    }
  });
  await Promise.all(workers);

  const redirectsInSitemap = results.filter((r) => {
    const isRedirect = r.redirectHops > 0 || (r.status >= 300 && r.status < 400);
    if (!isRedirect) return false;
    return !isHostAliasRedirect(r.url, r.finalUrl);
  });
  const non200 = results.filter((r) => r.status !== 200);
  const canonicalToRedirect = results.filter(
    (r) => {
      if (!r.canonical || !r.canonicalStatus) return false;
      if (r.canonicalStatus < 300 || r.canonicalStatus >= 400) return false;
      if (r.canonicalRedirectTo && isHostAliasRedirect(r.canonical, r.canonicalRedirectTo)) return false;
      return true;
    }
  );
  const canonicalMismatch = results.filter((r) => r.canonical && r.canonical !== r.finalUrl);
  const redirectChains = results.filter((r) => r.redirectHops > 1 && !isHostAliasRedirect(r.url, r.finalUrl));
  const shortDescriptions = results.filter(
    (r) => typeof r.metaDescriptionLength === "number" && r.metaDescriptionLength < 150
  );
  const missingBreadcrumb = results.filter((r) => r.hasBreadcrumbSchema === false);
  const invalidArticleSchema = results.filter((r) => r.hasValidArticleSchema === false);
  const internalNofollow = results.filter((r) => (r.internalNofollowCount ?? 0) > 0);

  function print(label: string, items: AuditResult[], render?: (r: AuditResult) => string) {
    if (items.length === 0) return;
    console.log(`\n${label}: ${items.length}`);
    items.slice(0, 20).forEach((r) => console.log(render ? render(r) : `- ${r.url}`));
    if (items.length > 20) console.log(`- ...and ${items.length - 20} more`);
  }

  print("Redirects in sitemap", redirectsInSitemap, (r) => `- ${r.url} -> ${r.finalUrl} (${r.status})`);
  print("Non-200 pages", non200, (r) => `- ${r.url} (${r.status})`);
  print("Canonical points to redirect", canonicalToRedirect, (r) => `- ${r.url} canonical=${r.canonical} (${r.canonicalStatus})`);
  print("Canonical mismatch", canonicalMismatch, (r) => `- ${r.url} canonical=${r.canonical} final=${r.finalUrl}`);
  print("Redirect chains", redirectChains, (r) => `- ${r.url} hops=${r.redirectHops}`);
  print("Meta descriptions too short (<150)", shortDescriptions, (r) => `- ${r.url} (${r.metaDescriptionLength})`);
  print("Missing BreadcrumbList schema", missingBreadcrumb);
  print("Invalid Article schema", invalidArticleSchema);
  print("Internal links with nofollow", internalNofollow, (r) => `- ${r.url} nofollow=${r.internalNofollowCount}`);

  const criticalCount =
    redirectsInSitemap.length +
    non200.length +
    canonicalToRedirect.length +
    redirectChains.length;

  if (criticalCount > 0) {
    console.error(`\nseo-audit failed: ${criticalCount} critical issues detected.`);
    process.exitCode = 1;
    return;
  }

  const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  const bingPing = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  await Promise.allSettled([fetch(googlePing), fetch(bingPing)]);
  console.log("\nseo-audit passed.");
}

run().catch((e) => {
  console.error("seo-audit crashed:", e);
  process.exitCode = 1;
});
