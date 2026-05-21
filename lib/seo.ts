export const SITE_ORIGIN =
  (process.env.NEXT_PUBLIC_SITE_ORIGIN && process.env.NEXT_PUBLIC_SITE_ORIGIN.length > 0
    ? process.env.NEXT_PUBLIC_SITE_ORIGIN
    : undefined) ?? "https://www.boomkas.com";

type Branded<T, Brand extends string> = T & { readonly __brand: Brand };
export type MetaDescription = Branded<string, "MetaDescription">;

function normalizeOrigin(origin: string) {
  try {
    return new URL(origin).origin;
  } catch {
    return "https://www.boomkas.com";
  }
}

export function normalizePathname(pathname: string) {
  const raw = pathname.trim();
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  const withoutHash = withLeading.split("#")[0] ?? "/";
  const withoutQuery = (withoutHash.split("?")[0] ?? "/").trim();
  const lower = withoutQuery.toLowerCase();
  if (lower === "/") return "/";
  return lower.endsWith("/") ? lower.slice(0, -1) : lower;
}

export function canonicalUrl(pathOrUrl: string) {
  const base = normalizeOrigin(SITE_ORIGIN);
  try {
    const url = new URL(pathOrUrl, base);
    const pathname = normalizePathname(url.pathname);
    const canonical = new URL(pathname, base);
    if (url.search) canonical.search = url.search;
    return canonical.toString();
  } catch {
    return new URL(normalizePathname(pathOrUrl), base).toString();
  }
}

export function canonicalAlternates(pathname: string) {
  return { canonical: canonicalUrl(pathname) };
}

function clampDescriptionLength(text: string, min = 150, max = 160) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length >= min && normalized.length <= max) return normalized;

  if (normalized.length > max) {
    const sliced = normalized.slice(0, max);
    const lastStop = Math.max(sliced.lastIndexOf("."), sliced.lastIndexOf("!"), sliced.lastIndexOf("?"));
    const trimmed = (lastStop >= min ? sliced.slice(0, lastStop + 1) : sliced).trim();
    return trimmed.length >= min ? trimmed : sliced.trim();
  }

  const suffix =
    " Compare agentic AI tools, pricing, autonomy, pros/cons, and real workflows on Boomkas.";
  const padded = `${normalized}${normalized.endsWith(".") ? "" : "."}${suffix}`;
  if (padded.length <= max) return padded;
  return clampDescriptionLength(padded, min, max);
}

export function generateMetaDescription(input: {
  title?: string;
  description?: string;
  parts?: Array<string | undefined | null>;
}): MetaDescription {
  const pieces = [
    input.description,
    input.title ? `${input.title}.` : undefined,
    ...(input.parts ?? []),
  ]
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .map((p) => p.trim());

  const base =
    pieces.length > 0
      ? pieces.join(" ")
      : "Discover, compare, and master the best agentic AI tools that plan, reason, and execute workflows autonomously.";

  return clampDescriptionLength(base) as MetaDescription;
}

export function normalizeCanonicalHost(requestUrl: URL) {
  const host = requestUrl.host.toLowerCase();
  const preferred = new URL(SITE_ORIGIN).host.toLowerCase();
  return host === preferred ? null : preferred;
}
