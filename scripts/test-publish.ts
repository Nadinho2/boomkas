export {};

const BASE_URL = process.env.BASE_URL?.trim() || "http://localhost:3000";

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sanityQuery<T>(query: string, params?: Record<string, unknown>) {
  const projectId = env("SANITY_PROJECT_ID");
  const dataset = env("SANITY_DATASET");
  const apiVersion = process.env.SANITY_API_VERSION ?? "2021-06-07";
  const token = process.env.SANITY_API_TOKEN;

  const base = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
  const sp = new URLSearchParams();
  sp.set("query", query);
  if (params) for (const [k, v] of Object.entries(params)) sp.set(`$${k}`, JSON.stringify(v));

  const res = await fetch(`${base}?${sp.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Sanity query failed (${res.status}): ${text.slice(0, 250)}`);
  const json = JSON.parse(text) as { result: T };
  return json.result;
}

async function main() {
  const apiKey = env("PUBLISH_API_KEY");
  const now = new Date();
  const slug = `test-n8n-publish-${now.toISOString().slice(0, 10)}-${now.getTime().toString(36).slice(-4)}`;

  const payload = {
    title: `Test Publish Post (${now.toISOString()})`,
    slug,
    metaDescription: "Test publish via /api/publish from n8n-style payload. This is safe to delete.",
    featuredImageAlt: "Test featured image alt",
    tldr: "- Fast sanity write\n- Portable text conversion\n- Sitemap + pings",
    starRating: 4.5,
    body: [
      `Tested By: Boomkas Team (Hands-on testing across real workflows)`,
      `Last Tested: ${now.toISOString().slice(0, 10)}`,
      `Updated: ${now.toISOString().slice(0, 10)}`,
      "",
      "## Our Testing Process",
      "We ran a real workflow end-to-end, validated output, and captured trade-offs.",
      "",
      "## What We Found",
      "- The publish endpoint validates required fields and converts text to Portable Text.",
      "- The blog page renders Sanity blocks and shows TL;DR + rating + FAQ.",
      "",
      "## Unique Insight",
      "When you enforce a content gate at publish time, you prevent thin content from ever reaching Google.",
      "",
      "## Pricing Breakdown",
      "Pricing needs verification. https://example.com/pricing",
      "",
      "## Pros",
      "- Fast",
      "- Reliable",
      "- Secure",
      "- Structured",
      "- Automated",
      "",
      "## Cons",
      "- Needs Sanity token",
      "- Rate limited",
      "- Requires correct payload",
      "- Portable Text is structured",
      "- Schema must match",
      "",
      "## Comparison",
      "Compared to a manual CMS workflow, this is fully automated and faster.",
      "",
      "## Final Verdict",
      "4.5/5. Great for automated publishing pipelines.",
      "",
      "## FAQ",
      "Q: Does it ping Google?\nA: Yes, after publish.",
    ].join("\n"),
    faq: [
      { question: "Does /api/publish validate required fields?", answer: "Yes. It returns 400 on missing fields." },
      { question: "Does it rate limit?", answer: "Yes. 10 requests per minute per IP (best-effort in-memory)." },
      { question: "Does it store Portable Text?", answer: "Yes. The body is converted and stored as portable text blocks." },
      { question: "Will it update the sitemap?", answer: "Sitemap is dynamic and includes Sanity posts." },
      { question: "Can I delete this test post?", answer: "Yes, remove the doc post.<slug> in Sanity." },
    ],
    affiliateDisclosure: "Some links may be affiliate links. This is a test disclosure.",
    lastTested: now.toISOString().slice(0, 10),
    primaryKeyword: "test publish",
    category: "Tool Comparisons",
  };

  console.log(`1) POST ${BASE_URL}/api/publish slug=${slug}`);
  const publishRes = await fetch(`${BASE_URL}/api/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify(payload),
  });
  const publishText = await publishRes.text();
  console.log(`   status=${publishRes.status}`);
  console.log(`   body=${publishText.slice(0, 600)}`);
  if (!publishRes.ok) process.exit(1);

  console.log("2) Confirm doc exists in Sanity");
  await sleep(800);
  const sanity = await sanityQuery<{ _id?: string } | null>(
    '*[_type=="post" && slug.current==$slug][0]{ "_id": _id }',
    { slug }
  );
  console.log(`   sanity._id=${sanity?._id ?? "NOT FOUND"}`);
  if (!sanity?._id) process.exit(1);

  console.log(`3) Confirm page renders: ${BASE_URL}/blog/${slug}`);
  const pageRes = await fetch(`${BASE_URL}/blog/${slug}`, { redirect: "manual" });
  console.log(`   status=${pageRes.status}`);
  if (pageRes.status !== 200) process.exit(1);

  console.log(`4) Confirm sitemap includes URL: ${BASE_URL}/sitemap.xml`);
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  const sitemapXml = await sitemapRes.text();
  console.log(`   status=${sitemapRes.status}`);
  if (!sitemapRes.ok) process.exit(1);
  const expectedUrl = `https://boomkas.com/blog/${slug}`;
  const found = sitemapXml.includes(expectedUrl) || sitemapXml.includes(`${BASE_URL.replace(/\/$/, "")}/blog/${slug}`);
  console.log(`   containsPostUrl=${found}`);
  if (!found) process.exit(1);

  console.log("OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
