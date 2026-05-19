import { cookies, headers } from "next/headers";

export type Region = "us" | "uk" | "ca" | "au" | "in" | "sg" | "ng";

export type RegionConfig = {
  label: string;
  currency: string;
  currencySymbol: string;
  hreflang: string;
  tier: 1 | 2 | 3;
};

export const REGION_CONFIG: Record<Region, RegionConfig> = {
  us: { label: "United States", currency: "USD", currencySymbol: "$", hreflang: "en-US", tier: 1 },
  uk: { label: "United Kingdom", currency: "GBP", currencySymbol: "£", hreflang: "en-GB", tier: 1 },
  ca: { label: "Canada", currency: "CAD", currencySymbol: "CA$", hreflang: "en-CA", tier: 1 },
  au: { label: "Australia", currency: "AUD", currencySymbol: "A$", hreflang: "en-AU", tier: 1 },
  in: { label: "India", currency: "INR", currencySymbol: "₹", hreflang: "en-IN", tier: 2 },
  sg: { label: "Singapore", currency: "SGD", currencySymbol: "S$", hreflang: "en-SG", tier: 2 },
  ng: { label: "Nigeria", currency: "NGN", currencySymbol: "₦", hreflang: "en-NG", tier: 3 },
};

export async function getRegion(): Promise<Region> {
  const cookieStore = await cookies();
  const regionCookie = cookieStore.get("boomkas-region");
  return (regionCookie?.value as Region) || "us";
}

export async function getCountry(): Promise<string> {
  const headersList = await headers();
  const countryHeader = headersList.get("x-user-country");
  return countryHeader || "US";
}

export function getRegionConfig(region: Region): RegionConfig {
  return REGION_CONFIG[region] || REGION_CONFIG["us"];
}
