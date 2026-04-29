"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image as ImageIcon,
  LayoutDashboard,
  Settings,
  Sheet,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ICONS = {
  dashboard: LayoutDashboard,
  posts: Sheet,
  tools: Wrench,
  media: ImageIcon,
  settings: Settings,
} as const;

type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
};

export default function AdminNav({
  items,
  variant,
}: {
  items: NavItem[];
  variant: "sidebar" | "pills";
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href + "/")) ||
          (item.href !== "/admin" && pathname === item.href);

        if (variant === "sidebar") {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group inline-flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-white/5 text-foreground shadow-[inset_0_0_0_1px_rgba(0,240,255,0.22)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition",
                  isActive
                    ? "text-[color:var(--primary)]"
                    : "text-[color:var(--primary)]/80 group-hover:text-[color:var(--primary)]"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-white/[0.08] text-foreground shadow-[inset_0_0_0_1px_rgba(0,240,255,0.22)]"
                : "bg-white/5 text-muted-foreground hover:bg-white/[0.07] hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 text-[color:var(--primary)]/80" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
