import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AffiliateDisclosureBanner({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[color:var(--secondary)]/25 bg-[rgba(255,107,0,0.06)] px-6 py-5 shadow-[inset_0_0_0_1px_rgba(255,107,0,0.16)]",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="default">Affiliate disclosure</Badge>
        <Badge variant="cyan">Transparency</Badge>
      </div>
      <div className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
        Some links on this page are affiliate links. If you purchase through them, we may earn a commission at no extra cost to you.
      </div>
    </div>
  );
}

