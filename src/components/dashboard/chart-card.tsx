"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ChartCardProps } from "./types";

export function ChartCard({ title, description, children, className, action }: ChartCardProps & { action?: ReactNode }) {
  return (
    <div className={cn("rounded-lg border border-border bg-background", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <div className="text-[13.5px] font-medium tracking-[-0.005em]">{title}</div>
            {description && (
              <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>
            )}
          </div>
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
