import Link from "next/link";
import { DownloadSimple, Plus } from "@phosphor-icons/react/dist/ssr";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { primarySampleFeature } from "@/lib/sample-features";

function formatToday(): string {
  const fmt = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} / ${get("weekday")} / JST`;
}
import { KpiCard, KpiStrip } from "@/components/dashboard/kpi-card";
import { Button } from "@/components/ui/button";
import { DashboardChartsLoader } from "./dashboard-charts-loader";
import {
  kpiData,
  monthlySalesData,
  dailyVisitorsData,
  categorySalesData,
  topMenuItems,
} from "./_data/sample-data";

export default async function DashboardPage() {
  await requireAuthenticatedUser();

  return (
    <div>
      {/* Header strip */}
      <div className="border-b border-border px-5 pb-3.5 pt-4.5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-xs tracking-[0.04em] text-muted-foreground">
              {formatToday()}
            </div>
            <h1 className="mt-1 text-[23px] font-semibold tracking-[-0.022em]">
              Dashboard
            </h1>
            <p className="mt-0.5 text-[13.5px] text-muted-foreground">
              飲食店サンプル / 売上と来客の概況。
              <span className="text-foreground">3月は前年比 +21.1%</span> で好調です。
            </p>
          </div>
          <div className="flex gap-1.5">
            {/* TODO: Export機能を実装 */}
            <Button variant="outline" size="sm" disabled>
              <DownloadSimple className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button size="sm" asChild>
              <Link href={primarySampleFeature.newHref}>
                <Plus className="h-3.5 w-3.5" />
                New {primarySampleFeature.singularLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiStrip>
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </KpiStrip>

      {/* Charts */}
      <DashboardChartsLoader
        monthlySalesData={monthlySalesData}
        dailyVisitorsData={dailyVisitorsData}
        categorySalesData={categorySalesData}
        topMenuItems={topMenuItems}
      />
    </div>
  );
}
