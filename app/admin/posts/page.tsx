import { createSupabaseServerClient } from "@/lib/supabase";
import PostsTable, { type AdminPostRow } from "./posts-table";

export default async function AdminPostsPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("posts")
    .select("id,title,slug,category,status,published_at,excerpt,content,updated_at")
    .order("updated_at", { ascending: false });

  const posts = (data ?? []) as AdminPostRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, edit, and publish content for Boomkas.
        </p>
      </div>

      <PostsTable posts={posts} />
    </div>
  );
}
