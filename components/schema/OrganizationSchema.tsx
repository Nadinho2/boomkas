import { JsonLd } from "@/components/schema/JsonLd";
import { SITE_ORIGIN } from "@/lib/seo";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Boomkas",
    url: SITE_ORIGIN,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}/og.png`,
      width: 1200,
      height: 630,
    },
  };

  return <JsonLd data={schema} />;
}
