import { CurrencyJpy, Users, Receipt, ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { RankingList } from "@/components/dashboard/ranking-list";
import { DashboardCharts } from "./dashboard-charts";
import {
  kpiData,
  monthlySalesData,
  dailyVisitorsData,
  categorySalesData,
  topMenuItems,
} from "./_data/sample-data";

const kpiIcons = [CurrencyJpy, Users, Receipt, ArrowsClockwise];

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

      <DashboardCharts
        monthlySalesData={monthlySalesData}
        dailyVisitorsData={dailyVisitorsData}
        categorySalesData={categorySalesData}
        topMenuItems={topMenuItems}
      />
    </div>
  );
}
