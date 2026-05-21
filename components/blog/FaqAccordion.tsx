import { cn } from "@/lib/utils";

export type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const safe = (items ?? []).filter((x) => x.question.trim().length && x.answer.trim().length).slice(0, 20);
  if (safe.length === 0) return null;

  return (
    <div className={cn("rounded-3xl bg-white/[0.02] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8", className)}>
      <div className="text-base font-semibold tracking-tight">FAQ</div>
      <div className="mt-4 space-y-3">
        {safe.map((f) => (
          <details
            key={`${f.question}-${f.answer.slice(0, 12)}`}
            className="rounded-2xl border border-border/60 bg-card/30 px-5 py-4"
          >
            <summary className="cursor-pointer text-sm font-medium text-foreground">{f.question}</summary>
            <div className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{f.answer}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

