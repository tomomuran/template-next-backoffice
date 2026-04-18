export default function ContactsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="space-y-px">
          <div className="h-11 animate-pulse bg-muted/60" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse bg-muted/30" style={{ animationDelay: `${i * 75}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
