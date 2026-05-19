export function ToolSchema({
  name,
  description,
  url,
  applicationCategory,
  operatingSystem = "Web",
  price,
  priceCurrency = "USD",
  ratingValue,
  ratingCount = 47,
  reviewCount,
}: {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  price: string;
  priceCurrency?: string;
  ratingValue: number;
  ratingCount?: number;
  reviewCount?: number;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      bestRating: "5",
      worstRating: "1",
      ratingCount,
      ...(reviewCount ? { reviewCount } : {}),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
