"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { format, jaLocale } from "./calendar-utils";
import type { CalendarViewMode } from "./calendar-types";

interface CalendarToolbarProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
  onNavigate: (direction: "prev" | "next" | "today") => void;
  onViewChange: (mode: CalendarViewMode) => void;
}

const viewLabels: { mode: CalendarViewMode; label: string }[] = [
  { mode: "month", label: "月" },
  { mode: "week", label: "週" },
  { mode: "day", label: "日" },
];

export function CalendarToolbar({ currentDate, viewMode, onNavigate, onViewChange }: CalendarToolbarProps) {
  const titleFormat = viewMode === "month" ? "yyyy年 M月" : viewMode === "week" ? "yyyy年 M月 d日〜" : "yyyy年 M月 d日 (E)";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate("today")}>
          今日
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onNavigate("prev")}>
          <CaretLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onNavigate("next")}>
          <CaretRight className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, titleFormat, { locale: jaLocale })}
        </h2>
      </div>

      <div className="flex rounded-lg border border-border bg-card p-0.5">
        {viewLabels.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onViewChange(mode)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              viewMode === mode
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
