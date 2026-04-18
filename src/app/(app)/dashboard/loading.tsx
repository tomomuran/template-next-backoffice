export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-36 animate-pulse rounded bg-muted" />
        <div className="h-4 w-56 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-lg border border-border bg-muted/50"
            style={{ animationDelay: `${i * 75}ms` }}
          />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" />
        <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" style={{ animationDelay: "100ms" }} />
      </div>
    </div>
  );
}
