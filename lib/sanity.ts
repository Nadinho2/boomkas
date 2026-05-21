type SanityBaseConfig = {
  projectId: string;
  dataset: string;
  apiVersion: string;
};

export type SanityLinkMarkDef = {
  _key: string;
  _type: "link";
  href: string;
};

export type SanitySpan = {
  _key: string;
  _type: "span";
  text: string;
  marks?: string[];
};

export type SanityBlock = {
  _key: string;
  _type: "block";
  style?: "normal" | "h2" | "h3";
  listItem?: "bullet";
  level?: number;
  children: SanitySpan[];
  markDefs?: SanityLinkMarkDef[];
};

export type SanityFaqItem = {
  _key: string;
  _type: "faqItem";
  question: string;
  answer: string;
};

export type SanityAuthorRef = {
  _id: string;
  name?: string;
  slug?: string;
};

export type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  metaDescription?: string;
  seoTitle?: string;
  featuredImageAlt?: string;
  tldr?: string;
  starRating?: number;
  faq?: Array<{ question: string; answer: string }>;
  affiliateDisclosure?: string;
  lastTested?: string;
  primaryKeyword?: string;
  category?: string;
  publishedAt?: string;
  author?: SanityAuthorRef;
  isAutoPublished?: boolean;
  body?: SanityBlock[];
  contentMarkdown?: string;
  _updatedAt?: string;
};

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function envOptional(name: string) {
  const value = process.env[name];
  return value && value.length ? value : undefined;
}

function sanityBase(): SanityBaseConfig {
  return {
    projectId: env("SANITY_PROJECT_ID"),
    dataset: env("SANITY_DATASET"),
    apiVersion: envOptional("SANITY_API_VERSION") ?? "2021-06-07",
  };
}

function sanityQueryUrl(query: string, params?: Record<string, unknown>) {
  const { projectId, dataset, apiVersion } = sanityBase();
  const base = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
  const sp = new URLSearchParams();
  sp.set("query", query);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      sp.set(`$${k}`, JSON.stringify(v));
    }
  }
  return `${base}?${sp.toString()}`;
}

function sanityMutateUrl() {
  const { projectId, dataset, apiVersion } = sanityBase();
  return `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
}

function sanityReadHeaders(): Record<string, string> {
  const token = envOptional("SANITY_API_TOKEN");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function sanityWriteHeaders() {
  const token = env("SANITY_API_TOKEN");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function sanityQuery<T>(input: { query: string; params?: Record<string, unknown>; useCdn?: boolean }) {
  const url = sanityQueryUrl(input.query, input.params);
  const res = await fetch(url, {
    headers: sanityReadHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Sanity query failed (${res.status})`);
  const data = (await res.json()) as unknown;
  if (!data || typeof data !== "object") throw new Error("Sanity query invalid response");
  const result = (data as { result?: unknown }).result;
  return result as T;
}

export async function sanityMutate<T>(mutations: unknown[]): Promise<T> {
  const res = await fetch(sanityMutateUrl(), {
    method: "POST",
    headers: sanityWriteHeaders(),
    body: JSON.stringify({ mutations, returnDocuments: true }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity mutate failed (${res.status}): ${text.slice(0, 400)}`);
  }
  const data = (await res.json()) as unknown;
  return data as T;
}

export async function sanityFetchPostBySlug(slug: string): Promise<SanityPost | null> {
  const q =
    '*[_type == "post" && slug.current == $slug][0]{' +
    '_id,' +
    'title,' +
    '"slug": slug.current,' +
    "metaDescription,seoTitle,featuredImageAlt,tldr,starRating,affiliateDisclosure,lastTested,primaryKeyword,category,publishedAt,isAutoPublished," +
    "body,contentMarkdown,_updatedAt," +
    'author->{"_id": _id, "name": name, "slug": slug.current},' +
    'faq[]{question,answer}' +
    "}";
  const result = await sanityQuery<SanityPost | null>({ query: q, params: { slug } });
  if (!result || typeof result !== "object") return null;
  if (typeof (result as { slug?: unknown }).slug !== "string") return null;
  return result;
}

export async function sanityFetchPublishedPosts(input?: {
  limit?: number;
}): Promise<Array<{ slug: string; publishedAt?: string; _updatedAt?: string; title?: string; category?: string; metaDescription?: string; starRating?: number }>> {
  const limit = Math.max(1, Math.min(2000, input?.limit ?? 500));
  const q =
    '*[_type == "post" && defined(slug.current) && defined(publishedAt)]|order(publishedAt desc)[0...' +
    String(limit) +
    ']{ "slug": slug.current, publishedAt, _updatedAt, title, category, metaDescription, starRating }';
  const result = await sanityQuery<
    Array<{
      slug?: unknown;
      publishedAt?: unknown;
      _updatedAt?: unknown;
      title?: unknown;
      category?: unknown;
      metaDescription?: unknown;
      starRating?: unknown;
    }>
  >({ query: q });
  return (result ?? [])
    .map((r) => ({
      slug: typeof r.slug === "string" ? r.slug : "",
      publishedAt: typeof r.publishedAt === "string" ? r.publishedAt : undefined,
      _updatedAt: typeof r._updatedAt === "string" ? r._updatedAt : undefined,
      title: typeof r.title === "string" ? r.title : undefined,
      category: typeof r.category === "string" ? r.category : undefined,
      metaDescription: typeof r.metaDescription === "string" ? r.metaDescription : undefined,
      starRating: typeof r.starRating === "number" ? r.starRating : undefined,
    }))
    .filter((r) => r.slug.length > 0);
}

export async function sanityResolveAuthorIdBySlug(authorSlug: string): Promise<string | null> {
  const q = '*[_type == "author" && slug.current == $slug][0]{ "_id": _id }';
  const result = await sanityQuery<{ _id?: unknown } | null>({ query: q, params: { slug: authorSlug } }).catch(
    () => null
  );
  const id = result && typeof result === "object" ? (result as { _id?: unknown })._id : undefined;
  return typeof id === "string" ? id : null;
}

export async function sanityEnsureAuthor(input: {
  slug: string;
  name: string;
  bio?: string;
  credentials?: string;
}): Promise<string> {
  const slug = input.slug.trim();
  const name = input.name.trim();
  if (!slug) throw new Error("Missing author slug");
  if (!name) throw new Error("Missing author name");

  const existing = await sanityResolveAuthorIdBySlug(slug);
  if (existing) return existing;

  const docId = `author.${slug}`;
  await sanityMutate([
    {
      createOrReplace: {
        _id: docId,
        _type: "author",
        name,
        slug: { _type: "slug", current: slug },
        bio: input.bio,
        credentials: input.credentials,
      },
    },
  ]);
  return docId;
}
