import { getAffiliateLink } from "@/lib/affiliates";
import { cn } from "@/lib/utils";
import { AffiliateLink } from "@/components/Links";

export function AffiliateButton({
  slug,
  variant = "primary",
  size = "md",
  className,
}: {
  slug: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const entry = getAffiliateLink(slug);
  if (!entry) return null;

  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variantClass =
    variant === "secondary"
      ? "bg-secondary text-secondary-foreground shadow-[0_0_0_1px_rgba(255,107,0,0.25),0_10px_30px_rgba(255,107,0,0.12)] hover:shadow-[0_0_0_1px_rgba(255,107,0,0.32),0_12px_36px_rgba(255,107,0,0.18)] hover:brightness-110"
      : "bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(0,240,255,0.25),0_10px_30px_rgba(0,240,255,0.15)] hover:shadow-[0_0_0_1px_rgba(0,240,255,0.35),0_12px_36px_rgba(0,240,255,0.22)] hover:brightness-110";
  const sizeClass = size === "lg" ? "h-14 px-7 text-base" : size === "sm" ? "h-10 px-4" : "h-12 px-5";

  const badgeBase =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-tight shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]";
  const badgeClass =
    entry.badge === "Best Deal"
      ? "bg-[rgba(255,107,0,0.12)] text-[color:var(--secondary)] shadow-[inset_0_0_0_1px_rgba(255,107,0,0.22)]"
      : "bg-[rgba(0,240,255,0.12)] text-[color:var(--primary)] shadow-[inset_0_0_0_1px_rgba(0,240,255,0.22)]";

  return (
    <AffiliateLink href={`/go/${entry.slug}`} className={cn(base, variantClass, sizeClass, className)}>
      {entry.badge ? <span className={cn(badgeBase, badgeClass)}>{entry.badge}</span> : null}
      {entry.label}
    </AffiliateLink>
  );
}
