import { createSupabaseServerClient } from "@/lib/supabase";
import ToolsTable, { type AdminToolRow } from "./tools-table";

export default async function AdminToolsPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("tools")
    .select(
      "id,name,slug,category,pricing,autonomyLevel,rating,bestFor,keyFeatures,affiliateLink,logo,description,updated_at"
    )
    .order("updated_at", { ascending: false });

  const tools = (data ?? []) as AdminToolRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage tool listings for the public comparison table and review pages.
        </p>
      </div>

      <ToolsTable tools={tools} />
    </div>
  );
}

