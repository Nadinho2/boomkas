type SanityPost = {
  _id: string;
  slug: string;
  title: string;
};

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function sanityBase() {
  const projectId = env("SANITY_PROJECT_ID");
  const dataset = env("SANITY_DATASET");
  const apiVersion = process.env.SANITY_API_VERSION ?? "2025-01-01";
  return { projectId, dataset, apiVersion };
}

function sanityHeaders() {
  const token = env("SANITY_API_TOKEN");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function sanityFetchExistingBlogSlugs(limit = 200): Promise<string[]> {
  const { projectId, dataset, apiVersion } = sanityBase();
  const query =
    '*[_type == "post" && defined(slug.current)]|order(_updatedAt desc)[0...' +
    String(limit) +
    ']{ "slug": slug.current }';
  const url =
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=` +
    encodeURIComponent(query);
  const res = await fetch(url, { headers: sanityHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error(`Sanity query failed (${res.status})`);
  const data = (await res.json()) as unknown;
  const result =
    data && typeof data === "object" && Array.isArray((data as { result?: unknown }).result)
      ? ((data as { result: unknown[] }).result as unknown[])
      : [];
  return result
    .map((r: unknown) => {
      if (!r || typeof r !== "object") return "";
      const slug = (r as { slug?: unknown }).slug;
      return typeof slug === "string" ? slug : "";
    })
    .filter((s) => s.length > 0);
}

export async function sanityUpsertPost(input: {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  contentMarkdown: string;
  publishedAtISO: string;
  keyword?: string;
}): Promise<SanityPost> {
  const { projectId, dataset, apiVersion } = sanityBase();
  const mutationUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;

  const docId = `post.${input.slug}`;
  const mutations = [
    {
      createOrReplace: {
        _id: docId,
        _type: "post",
        title: input.title,
        excerpt: input.excerpt,
        metaDescription: input.metaDescription,
        category: input.category,
        publishedAt: input.publishedAtISO,
        keyword: input.keyword ?? input.slug,
        slug: { _type: "slug", current: input.slug },
        contentMarkdown: input.contentMarkdown,
      },
    },
  ];

  const res = await fetch(mutationUrl, {
    method: "POST",
    headers: sanityHeaders(),
    body: JSON.stringify({ mutations, returnDocuments: true }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity mutate failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as unknown;
  let id = docId;
  if (data && typeof data === "object") {
    const results = (data as { results?: unknown }).results;
    if (Array.isArray(results) && results[0] && typeof results[0] === "object") {
      const document = (results[0] as { document?: unknown }).document;
      if (document && typeof document === "object") {
        const _id = (document as { _id?: unknown })._id;
        if (typeof _id === "string") id = _id;
      }
    }
  }

  return { _id: id, slug: input.slug, title: input.title };
}
