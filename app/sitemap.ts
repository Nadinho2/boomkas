import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://boomkas.com";

  const staticRoutes = [
    "",
    "/tools",
    "/blog",
    "/compare",
    "/alternatives",
    "/guides",
    "/use-cases",
    "/about",
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  const supabase =
    supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
      : null;

  const readSlug = (row: unknown) => {
    if (!row || typeof row !== "object") return "";
    const slug = (row as { slug?: unknown }).slug;
    return typeof slug === "string" ? slug : "";
  };

  const getToolSlugs = async () => {
    if (!supabase) return [] as string[];
    const { data } = await supabase.from("tools").select("slug").limit(500);
    return (data ?? []).map(readSlug).filter((s) => s.length > 0);
  };

  const getBlogSlugs = async () => {
    if (!supabase) return [] as string[];
    const { data } = await supabase.from("posts").select("slug,status").eq("status", "published").limit(2000);
    return (data ?? []).map(readSlug).filter((s) => s.length > 0);
  };

  const getCompareSlugs = async () => [] as string[];
  const getAlternativeSlugs = async () => [] as string[];
  const getGuideSlugs = async () => [] as string[];
  const getUseCaseSlugs = async () => [] as string[];

  const [toolSlugs, blogSlugs, compareSlugs, alternativeSlugs, guideSlugs, useCaseSlugs] =
    await Promise.all([
    getToolSlugs(),
    getBlogSlugs(),
    getCompareSlugs(),
    getAlternativeSlugs(),
    getGuideSlugs(),
    getUseCaseSlugs(),
  ]);

  const dynamicRoutes = [
    ...toolSlugs.map((slug) => `/tools/${slug}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
    ...compareSlugs.map((slug) => `/compare/${slug}`),
    ...alternativeSlugs.map((slug) => `/alternatives/${slug}`),
    ...guideSlugs.map((slug) => `/guides/${slug}`),
    ...useCaseSlugs.map((slug) => `/use-cases/${slug}`),
  ];

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const sitemapEntries: MetadataRoute.Sitemap = allRoutes.map((route) => {
    let priority = 0.8;
    let changeFrequency: "daily" | "weekly" | "always" | "hourly" | "monthly" | "yearly" | "never" =
      "weekly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route.startsWith("/compare")) {
      priority = 0.9;
    }

    const url = `${baseUrl}${route}`;

    return {
      url,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          "en-US": url,
          "en-GB": url,
          "en-CA": url,
          "en-AU": url,
          "en-IN": url,
          "en-SG": url,
        },
      },
    };
  });

  return sitemapEntries;
}
