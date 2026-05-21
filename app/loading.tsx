export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="space-y-6">
        <div className="h-8 w-2/3 animate-pulse rounded-xl bg-white/5" />
        <div className="h-4 w-1/2 animate-pulse rounded-xl bg-white/5" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-border/60 bg-card/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

