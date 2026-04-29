import { createSupabaseServerClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RecentActivityItem = {
  id: string;
  title: string | null;
  status: string | null;
  updated_at: string | null;
};

export default async function AdminOverviewPage() {
  const supabase = await createSupabaseServerClient();

  const [{ count: totalPosts }, { count: publishedPosts }, { count: totalTools }] =
    await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase.from("tools").select("*", { count: "exact", head: true }),
    ]);

  const { data: recentActivity } = await supabase
    .from("posts")
    .select("id,title,status,updated_at")
    .order("updated_at", { ascending: false })
    .limit(6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A quick snapshot of content and activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Posts" value={totalPosts ?? 0} />
        <StatCard title="Published Posts" value={publishedPosts ?? 0} />
        <StatCard title="Total Tools" value={totalTools ?? 0} />
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(recentActivity as RecentActivityItem[] | null)?.length ? (
                (recentActivity as RecentActivityItem[]).slice(0, 3).map((item) => (
                  <div key={item.id} className="text-sm">
                    <div className="truncate font-medium text-foreground">
                      {item.title ?? "Untitled"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.status ?? "—"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No activity yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(recentActivity as RecentActivityItem[] | null)?.length ? (
              (recentActivity as RecentActivityItem[]).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {item.title ?? "Untitled"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.status ?? "—"}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">
                    {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "—"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                No posts found. Create your first post in Posts.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

