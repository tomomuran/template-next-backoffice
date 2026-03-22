import type { KpiCardProps, RankingListProps } from "@/components/dashboard/types";

export const kpiData: Omit<KpiCardProps, "icon">[] = [
  { label: "売上高", value: "¥2,847,300", change: 12.5, trend: "up" },
  { label: "来客数", value: "1,234人", change: -3.2, trend: "down" },
  { label: "客単価", value: "¥2,308", change: 16.3, trend: "up" },
  { label: "リピート率", value: "42.8%", change: 2.1, trend: "up" },
];

export const monthlySalesData = [
  { month: "9月", 売上: 1_980_000, 前年: 1_850_000 },
  { month: "10月", 売上: 2_100_000, 前年: 1_950_000 },
  { month: "11月", 売上: 2_350_000, 前年: 2_100_000 },
  { month: "12月", 売上: 2_780_000, 前年: 2_500_000 },
  { month: "1月", 売上: 2_150_000, 前年: 1_900_000 },
  { month: "2月", 売上: 2_420_000, 前年: 2_200_000 },
  { month: "3月", 売上: 2_847_300, 前年: 2_350_000 },
];

export const dailyVisitorsData = [
  { day: "3/16", 来客数: 42, 予約: 28 },
  { day: "3/17", 来客数: 38, 予約: 25 },
  { day: "3/18", 来客数: 55, 予約: 40 },
  { day: "3/19", 来客数: 48, 予約: 32 },
  { day: "3/20", 来客数: 62, 予約: 45 },
  { day: "3/21", 来客数: 70, 予約: 52 },
  { day: "3/22", 来客数: 65, 予約: 48 },
];

export const categorySalesData = [
  { name: "食事", value: 1_250_000, color: "var(--chart-1)" },
  { name: "ドリンク", value: 820_000, color: "var(--chart-2)" },
  { name: "コース", value: 480_000, color: "var(--chart-3)" },
  { name: "デザート", value: 180_000, color: "var(--chart-4)" },
  { name: "その他", value: 117_300, color: "var(--chart-5)" },
];

export const topMenuItems: RankingListProps["items"] = [
  { rank: 1, label: "特製もつ鍋(2人前)", value: "¥328,000", ratio: 1.0 },
  { rank: 2, label: "刺身盛り合わせ", value: "¥285,600", ratio: 0.87 },
  { rank: 3, label: "焼き鳥5本セット", value: "¥224,400", ratio: 0.68 },
  { rank: 4, label: "季節の天ぷら盛り", value: "¥198,000", ratio: 0.60 },
  { rank: 5, label: "生ビール(中)", value: "¥186,200", ratio: 0.57 },
];
