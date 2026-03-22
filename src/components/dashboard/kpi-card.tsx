import { TrendUp, TrendDown, Minus } from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { KpiCardProps } from "./types";

export function KpiCard({ label, value, change, trend, icon: Icon, className }: KpiCardProps) {
  const resolvedTrend = trend ?? (change === undefined ? "flat" : change > 0 ? "up" : change < 0 ? "down" : "flat");

  const trendConfig = {
    up: { icon: TrendUp, color: "text-emerald-700 bg-emerald-50", sign: "+" },
    down: { icon: TrendDown, color: "text-red-700 bg-red-50", sign: "" },
    flat: { icon: Minus, color: "text-muted-foreground bg-muted", sign: "" },
  }[resolvedTrend];

  const TrendIcon = trendConfig.icon;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          {Icon && (
            <div className="rounded-lg bg-muted p-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
        {change !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium", trendConfig.color)}>
              <TrendIcon className="h-3 w-3" />
              {trendConfig.sign}{Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">前月比</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
