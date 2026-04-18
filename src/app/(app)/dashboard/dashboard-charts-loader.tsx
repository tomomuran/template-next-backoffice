"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { RankingListProps } from "@/components/dashboard/types";

const DashboardCharts = dynamic(
  () => import("./dashboard-charts").then((mod) => mod.DashboardCharts),
  { ssr: false }
);

function ChartsSkeleton() {
  return (
    <div className="grid gap-3 p-5 lg:grid-cols-2">
      <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" />
      <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" style={{ animationDelay: "100ms" }} />
      <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" style={{ animationDelay: "200ms" }} />
      <div className="h-72 animate-pulse rounded-lg border border-border bg-muted/50" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

interface Props {
  monthlySalesData: Record<string, string | number>[];
  dailyVisitorsData: Record<string, string | number>[];
  categorySalesData: { name: string; value: number; color: string }[];
  topMenuItems: RankingListProps["items"];
}

export function DashboardChartsLoader(props: Props) {
  return (
    <Suspense fallback={<ChartsSkeleton />}>
      <DashboardCharts {...props} />
    </Suspense>
  );
}
