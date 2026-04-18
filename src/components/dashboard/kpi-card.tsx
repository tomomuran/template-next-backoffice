import { TrendUp, TrendDown, Minus } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import type { KpiCardProps } from "./types";

const trendConfig = {
  up:   { icon: TrendUp,   style: "border-ok/20 bg-ok/8 text-ok", sign: "+" },
  down: { icon: TrendDown,  style: "border-bad/20 bg-bad/8 text-bad", sign: "" },
  flat: { icon: Minus,      style: "border-border bg-surface-2 text-muted-foreground", sign: "" },
} as const;

export function KpiCard({ label, value, change, trend, className }: KpiCardProps) {
  const resolvedTrend = trend ?? (change === undefined ? "flat" : change > 0 ? "up" : change < 0 ? "down" : "flat");
  const config = trendConfig[resolvedTrend];
  const TrendIcon = config.icon;

  return (
    <div className={cn("flex min-h-[108px] flex-col gap-2.5 px-5 py-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.04em] text-muted-foreground">
          {label}
        </span>
        {change !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium",
              config.style
            )}
          >
            <TrendIcon className="h-2.5 w-2.5" />
            {config.sign}{Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-[27px] font-medium leading-none tracking-[-0.025em]">
          {value}
        </div>
        {/* Sparkline placeholder - rendered inline via SVG in the page */}
      </div>
    </div>
  );
}

export function KpiStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 border-b border-border lg:grid-cols-4 [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-border">
      {children}
    </div>
  );
}
