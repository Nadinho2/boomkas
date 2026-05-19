import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/go/" }],
    host: "https://boomkas.com",
    sitemap: "https://boomkas.com/sitemap.xml",
  };
}

