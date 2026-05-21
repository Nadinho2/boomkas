"use client";

import { useCallback } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function track(event: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}

export function TocLinks({
  slug,
  items,
}: {
  slug: string;
  items: Array<{ id: string; label: string; level: 2 | 3 }>;
}) {
  const onClick = useCallback(
    (id: string, label: string) => {
      track("toc_click", { post_slug: slug, id, label });
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [slug]
  );

  return (
    <div className="space-y-2">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onClick(t.id, t.label)}
          className={[
            "block w-full text-left text-sm text-muted-foreground transition hover:text-foreground",
            t.level === 3 ? "pl-3" : "",
          ].join(" ")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

