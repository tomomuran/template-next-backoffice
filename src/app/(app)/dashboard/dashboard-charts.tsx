"use client";

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
    <div className="grid gap-3 p-5 lg:grid-cols-[1.4fr_1fr]">
      <ChartCard
        title="月別売上推移"
        description="直近7ヶ月 / 前年比較"
        action={
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-chart-1" />
              今年
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-chart-3 opacity-50" />
              前年
            </span>
          </div>
        }
      >
        <BarChartView
          data={monthlySalesData}
          xKey="month"
          bars={[
            { dataKey: "売上", label: "今年", color: "var(--chart-1)" },
            { dataKey: "前年", label: "前年", color: "#a5b4fc" },
          ]}
          yFormatter={yenFormatter}
          height={240}
        />
      </ChartCard>

      <ChartCard title="日別来客数" description="今週 / 予約内訳">
        <LineChartView
          data={dailyVisitorsData}
          xKey="day"
          lines={[
            { dataKey: "来客数", label: "来客数", color: "var(--chart-1)" },
            { dataKey: "予約", label: "予約", color: "var(--chart-4)" },
          ]}
          height={240}
        />
      </ChartCard>

      <ChartCard title="カテゴリ別売上" description="構成比">
        <DonutChartView
          data={categorySalesData}
          centerValue={`¥${(totalSales / 10000).toFixed(0)}万`}
          centerLabel="合計"
        />
      </ChartCard>

      <RankingList title="売上TOP5 メニュー" items={topMenuItems} />
    </div>
  );
}
