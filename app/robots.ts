import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/go/", "/admin/", "/api/", "/_not-found"],
      },
    ],
    host: "https://boomkas.com",
    sitemap: "https://boomkas.com/sitemap.xml",
  };
}
