import { Suspense } from "react";
import dynamic from "next/dynamic";
import { CurrencyJpy, Users, Receipt, ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import {
  kpiData,
  monthlySalesData,
  dailyVisitorsData,
  categorySalesData,
  topMenuItems,
} from "./_data/sample-data";

const DashboardCharts = dynamic(() => import("./dashboard-charts").then((mod) => mod.DashboardCharts), {
  ssr: false
});

const kpiIcons = [CurrencyJpy, Users, Receipt, ArrowsClockwise];

function ChartsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" />
        <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" style={{ animationDelay: "100ms" }} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" style={{ animationDelay: "200ms" }} />
        <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  await requireAuthenticatedUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">飲食店サンプル｜売上・来客状況</p>
      </div>

      <DashboardGrid className="grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} icon={kpiIcons[i]} />
        ))}
      </DashboardGrid>

      <Suspense fallback={<ChartsSkeleton />}>
        <DashboardCharts
          monthlySalesData={monthlySalesData}
          dailyVisitorsData={dailyVisitorsData}
          categorySalesData={categorySalesData}
          topMenuItems={topMenuItems}
        />
      </Suspense>
    </div>
  );
}
