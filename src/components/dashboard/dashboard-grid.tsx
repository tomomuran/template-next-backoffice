import { cn } from "@/lib/utils";
import type { DashboardGridProps } from "./types";

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return <div className={cn("grid gap-4", className)}>{children}</div>;
}
