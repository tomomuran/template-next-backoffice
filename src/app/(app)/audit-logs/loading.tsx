export default function AuditLogsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-36 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="space-y-px">
          <div className="h-11 animate-pulse bg-muted/60" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse bg-muted/30" style={{ animationDelay: `${i * 75}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
