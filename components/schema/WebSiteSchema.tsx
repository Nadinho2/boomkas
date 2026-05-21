import { JsonLd } from "@/components/schema/JsonLd";
import { SITE_ORIGIN } from "@/lib/seo";

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Boomkas",
    url: SITE_ORIGIN,
    description: "Discover, compare, and master the best agentic AI tools in 2026",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_ORIGIN}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={schema} />;
}
