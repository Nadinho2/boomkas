"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function track(event: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const p = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

function ShareButtons({ url, title, slug }: { url: string; title: string; slug: string }) {
  const encodedUrl = useMemo(() => encodeURIComponent(url), [url]);
  const encodedTitle = useMemo(() => encodeURIComponent(title), [title]);
  const x = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      track("share_copy_link", { post_slug: slug, url });
    } catch {
      track("share_copy_link_failed", { post_slug: slug, url });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          track("share_click", { platform: "x", post_slug: slug, url });
          window.open(x, "_blank", "noopener,noreferrer");
        }}
      >
        Share on X
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          track("share_click", { platform: "linkedin", post_slug: slug, url });
          window.open(linkedin, "_blank", "noopener,noreferrer");
        }}
      >
        Share on LinkedIn
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          track("share_click", { platform: "facebook", post_slug: slug, url });
          window.open(facebook, "_blank", "noopener,noreferrer");
        }}
      >
        Share on Facebook
      </Button>
      <Button type="button" variant="secondary" onClick={copy}>
        Copy Link
      </Button>
    </div>
  );
}

function HelpfulWidget({ slug }: { slug: string }) {
  const [choice, setChoice] = useState<"yes" | "no" | null>(() => {
    try {
      const stored = localStorage.getItem(`boomkas_helpful_${slug}`);
      return stored === "yes" || stored === "no" ? stored : null;
    } catch {
      return null;
    }
  });

  function vote(next: "yes" | "no") {
    setChoice(next);
    try {
      localStorage.setItem(`boomkas_helpful_${slug}`, next);
    } catch {}
    track("helpful_vote", { post_slug: slug, vote: next });
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card/40 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
      <div className="text-base font-semibold tracking-tight">Was this helpful?</div>
      <div className="mt-2 text-sm text-muted-foreground">Your feedback helps us improve future updates.</div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" variant={choice === "yes" ? "primary" : "secondary"} onClick={() => vote("yes")}>
          Yes
        </Button>
        <Button type="button" variant={choice === "no" ? "primary" : "secondary"} onClick={() => vote("no")}>
          No
        </Button>
      </div>
    </div>
  );
}

export function PostEnhancements({
  slug,
  url,
  title,
  className,
}: {
  slug: string;
  url: string;
  title: string;
  className?: string;
}) {
  const progress = useScrollProgress();
  const start = useRef<number | null>(null);
  const maxDepth = useRef(0);

  useEffect(() => {
    start.current = Date.now();
    track("post_view", { post_slug: slug });
    return () => {
      if (!start.current) return;
      const seconds = Math.max(0, Math.round((Date.now() - start.current) / 1000));
      track("time_on_page", { post_slug: slug, seconds });
    };
  }, [slug]);

  useEffect(() => {
    const p = Math.round(progress * 100);
    if (p <= maxDepth.current) return;
    maxDepth.current = p;
    if ([25, 50, 75, 90].includes(p)) {
      track("scroll_depth", { post_slug: slug, percent: p });
    }
  }, [progress, slug]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-transparent">
        <div
          className="h-full bg-[color:var(--primary)]"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <ShareButtons url={url} title={title} slug={slug} />

      <HelpfulWidget slug={slug} />

      <div className="fixed bottom-5 right-5 z-[60]">
        <Button
          type="button"
          variant="secondary"
          className="h-11 rounded-full px-4 shadow-[0_25px_70px_rgba(0,0,0,0.55)]"
          onClick={() => {
            track("back_to_top", { post_slug: slug });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Back to top
        </Button>
      </div>
    </div>
  );
}
