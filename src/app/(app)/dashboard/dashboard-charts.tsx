"use client";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { ChartCard } from "@/components/dashboard/chart-card";
import { BarChartView } from "@/components/dashboard/bar-chart-view";
import { LineChartView } from "@/components/dashboard/line-chart-view";
import { DonutChartView } from "@/components/dashboard/donut-chart-view";
import { RankingList } from "@/components/dashboard/ranking-list";
import type { RankingListProps } from "@/components/dashboard/types";

const yenFormatter = (v: number) => `¥${(v / 10000).toFixed(0)}万`;

interface DashboardChartsProps {
  monthlySalesData: Record<string, string | number>[];
  dailyVisitorsData: Record<string, string | number>[];
  categorySalesData: { name: string; value: number; color: string }[];
  topMenuItems: RankingListProps["items"];
}

export function DashboardCharts({
  monthlySalesData,
  dailyVisitorsData,
  categorySalesData,
  topMenuItems,
}: DashboardChartsProps) {
  const totalSales = categorySalesData.reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      <DashboardGrid className="grid-cols-1 lg:grid-cols-2">
        <ChartCard title="月別売上推移" description="直近7ヶ月の売上と前年比較">
          <BarChartView
            data={monthlySalesData}
            xKey="month"
            bars={[
              { dataKey: "売上", label: "今年", color: "var(--chart-1)" },
              { dataKey: "前年", label: "前年", color: "var(--chart-3)" },
            ]}
            yFormatter={yenFormatter}
          />
        </ChartCard>
        <ChartCard title="日別来客数" description="今週の来客数と予約内訳">
          <LineChartView
            data={dailyVisitorsData}
            xKey="day"
            lines={[
              { dataKey: "来客数", label: "来客数", color: "var(--chart-1)" },
              { dataKey: "予約", label: "予約", color: "var(--chart-4)" },
            ]}
          />
        </ChartCard>
      </DashboardGrid>

      <DashboardGrid className="grid-cols-1 lg:grid-cols-2">
        <ChartCard title="カテゴリ別売上構成">
          <DonutChartView
            data={categorySalesData}
            centerValue={`¥${(totalSales / 10000).toFixed(0)}万`}
            centerLabel="合計"
          />
        </ChartCard>
        <RankingList title="売上TOP5 メニュー" items={topMenuItems} />
      </DashboardGrid>
    </>
  );
}
