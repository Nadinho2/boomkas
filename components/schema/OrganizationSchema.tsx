import { JsonLd } from "@/components/schema/JsonLd";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Boomkas",
    url: "https://boomkas.com",
    logo: {
      "@type": "ImageObject",
      url: "https://boomkas.com/og.png",
      width: 1200,
      height: 630,
    },
  };

  return <JsonLd data={schema} />;
}

