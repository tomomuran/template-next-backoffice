import { cn } from "@/lib/utils";
import type { RankingListProps } from "./types";

export function RankingList({ title, items, className }: RankingListProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-background", className)}>
      <div className="border-b border-border px-4 py-3">
        <div className="text-[13.5px] font-medium tracking-[-0.005em]">{title}</div>
      </div>
      <div className="flex flex-col gap-2.5 p-4">
        {items.map((item) => (
          <div key={item.rank} className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5">
            <span className="grid h-[18px] w-[18px] place-items-center rounded border border-border bg-surface-2 font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] font-medium text-muted-foreground">
              {item.rank}
            </span>
            <div>
              <div className="mb-1 text-[13.5px]">{item.label}</div>
              {item.ratio !== undefined && (
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-600"
                    style={{ width: `${Math.min(item.ratio * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12.5px] text-muted-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
