import { cn } from "@/lib/utils";

export function StarRating({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : 0;
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const text = `${"★".repeat(full)}${half ? "½" : ""}${"☆".repeat(empty)}`;

  return (
    <div className={cn("inline-flex items-center gap-2", className)} aria-label={`Rating ${v} out of 5`}>
      <span className="text-sm font-medium text-foreground">{text}</span>
      <span className="text-xs text-muted-foreground">{v.toFixed(1)}/5</span>
    </div>
  );
}

