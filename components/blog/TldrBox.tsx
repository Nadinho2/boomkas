import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TldrBox({
  title = "TL;DR",
  bullets,
  className,
}: {
  title?: string;
  bullets: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="cyan">Summary</Badge>
        <Badge variant="default">Fast read</Badge>
      </div>
      <div className="mt-3 text-base font-semibold tracking-tight">{title}</div>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground sm:text-base">
        {bullets.map((b) => (
          <li key={b} className="leading-7">
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

