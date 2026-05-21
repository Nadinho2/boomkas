import { JsonLd } from "@/components/schema/JsonLd";
import { SITE_ORIGIN } from "@/lib/seo";

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "Boomkas Editorial Team",
  imageUrl,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
  imageUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Boomkas",
      url: SITE_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/og.png`,
        width: 1200,
        height: 630,
      },
    },
    image: {
      "@type": "ImageObject",
      url: imageUrl || `${SITE_ORIGIN}/og.png`,
      width: 1200,
      height: 630,
    },
  };

  return <JsonLd data={schema} />;
}
