import type { ComponentType, ReactNode } from "react";

export interface KpiCardProps {
  label: string;
  value: string;
  change?: number;
  trend?: "up" | "down" | "flat";
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}

export interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export interface BarDef {
  dataKey: string;
  label: string;
  color: string;
}

export interface BarChartViewProps {
  data: Record<string, string | number>[];
  xKey: string;
  bars: BarDef[];
  yFormatter?: (value: number) => string;
  height?: number;
}

export interface LineDef {
  dataKey: string;
  label: string;
  color: string;
}

export interface LineChartViewProps {
  data: Record<string, string | number>[];
  xKey: string;
  lines: LineDef[];
  yFormatter?: (value: number) => string;
  height?: number;
}

export interface DonutChartViewProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  centerLabel?: string;
  centerValue?: string;
  height?: number;
}

export interface RankingListProps {
  title: string;
  items: {
    rank: number;
    label: string;
    value: string;
    ratio?: number;
  }[];
  className?: string;
}

export interface DashboardGridProps {
  children: ReactNode;
  className?: string;
}
