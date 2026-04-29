import type { Metadata } from "next";
import Link from "next/link";

import {
  ComparisonTable,
  type AutonomyLevel,
  type ToolCategory,
  type ToolRow,
} from "@/components/ComparisonTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Sortable, filterable comparison table of the best agentic AI tools in 2026 — pricing, autonomy, integrations, and ratings.",
  alternates: { canonical: "/tools" },
};

const ALL_CATEGORIES: ToolCategory[] = [
  "Coding Agents",
  "IDE Agents",
  "Workflow Automation",
  "No-Code Builders",
  "Multi-Agent",
  "Personal Productivity",
  "Enterprise",
];

function parseCategories(raw: string | string[] | undefined): ToolCategory[] | undefined {
  const value = Array.isArray(raw) ? raw.join(",") : raw;
  if (!value) return undefined;
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const selected = parts.filter((p): p is ToolCategory => ALL_CATEGORIES.includes(p as ToolCategory));
  return selected.length > 0 ? selected : undefined;
}

function parseAutonomy(raw: string | string[] | undefined): AutonomyLevel | "All" | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return undefined;
  if (value === "Low" || value === "Medium" || value === "High" || value === "All") return value;
  return undefined;
}

function parseCategoriesFromDb(raw: string | null | undefined): ToolCategory[] {
  if (!raw) return [];
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const selected = parts.filter((p): p is ToolCategory => ALL_CATEGORIES.includes(p as ToolCategory));
  return selected;
}

function toAutonomyLevel(value: string | null | undefined): AutonomyLevel {
  if (value === "Low" || value === "Medium" || value === "High") return value;
  return "Medium";
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: dbTools } = await supabase
    .from("tools")
    .select("slug,name,bestFor,pricing,autonomyLevel,category,keyFeatures,rating,affiliateLink")
    .order("updated_at", { ascending: false });

  const extraRows: ToolRow[] = (dbTools ?? [])
    .filter((t) => typeof t?.slug === "string" && t.slug.length > 0)
    .map((t) => {
      const name = (t.name as string | null) ?? (t.slug as string);
      const bestFor = (t.bestFor as string | null) ?? "—";
      const pricing = (t.pricing as string | null) ?? "—";
      const autonomy = toAutonomyLevel(t.autonomyLevel as string | null);
      const categories = parseCategoriesFromDb(t.category as string | null);
      const features = (t.keyFeatures as string[] | null) ?? [];
      const rating = typeof t.rating === "number" ? t.rating : 0;
      const affiliateUrl = (t.affiliateLink as string | null) ?? "#";

      return {
        slug: t.slug as string,
        name,
        bestFor,
        pricing,
        autonomy,
        categories: categories.length ? categories : ["Coding Agents"],
        features,
        rating,
        affiliateUrl,
        hasReview: true,
      };
    });

  const initialSelectedCategories = parseCategories(searchParams?.categories);
  const initialAutonomy = parseAutonomy(searchParams?.autonomy);
  const initialQuery = typeof searchParams?.q === "string" ? searchParams?.q : undefined;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">Comparison</Badge>
            <Badge variant="default">Sortable</Badge>
            <Badge variant="default">Filterable</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Agentic AI Tools (2026)
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Use the table to narrow by category, autonomy level, and integrations. Then open a review to see real-world workflows, trade-offs, and “who it’s for.”
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="primary">
            <Link href="/tools/cursor">Read Cursor Review</Link>
          </Button>
        </div>
      </div>

      <ComparisonTable
        initialSelectedCategories={initialSelectedCategories}
        initialAutonomy={initialAutonomy}
        initialQuery={initialQuery}
        extraRows={extraRows}
      />
    </div>
  );
}
