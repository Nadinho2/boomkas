import type { Metadata } from "next";

import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard Overview", icon: "dashboard" },
  { href: "/admin/posts", label: "Posts", icon: "posts" },
  { href: "/admin/tools", label: "Tools", icon: "tools" },
  { href: "/admin/media", label: "Media", icon: "media" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
] as const;

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6">
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-24 rounded-2xl border border-border/70 bg-card/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">
              Boomkas{" "}
              <span className="text-[color:var(--primary)]">Admin</span>
            </div>
            <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
              Protected
            </span>
          </div>

          <nav aria-label="Admin" className="flex flex-col gap-1">
            <AdminNav items={[...NAV]} variant="sidebar" />
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 md:hidden">
          <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
            <div className="text-sm font-semibold tracking-tight">
              Boomkas{" "}
              <span className="text-[color:var(--primary)]">Admin</span>
            </div>
            <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
              Protected
            </span>
          </div>
          <div className="mt-3 overflow-x-auto">
            <div className="flex min-w-max gap-2">
              <AdminNav items={[...NAV]} variant="pills" />
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
