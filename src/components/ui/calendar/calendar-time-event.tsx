"use client";

import { cn } from "@/lib/utils";
import type { CalendarEvent, CalendarColorMap, CalendarTimeRange } from "./calendar-types";
import { calculateEventPosition, format } from "./calendar-utils";

interface CalendarTimeEventProps {
  event: CalendarEvent;
  timeRange: CalendarTimeRange;
  colorMap?: CalendarColorMap;
  column: number;
  totalColumns: number;
  onClick?: (event: CalendarEvent) => void;
}

const defaultColors = { bg: "bg-chart-1/15", text: "text-chart-1", border: "border-chart-1/40" };

export function CalendarTimeEvent({ event, timeRange, colorMap, column, totalColumns, onClick }: CalendarTimeEventProps) {
  const { top, height } = calculateEventPosition(event, timeRange);
  const colors = (event.colorKey && colorMap?.[event.colorKey]) || defaultColors;

  const width = `calc(${100 / totalColumns}% - 2px)`;
  const left = `calc(${(column / totalColumns) * 100}% + 1px)`;

  return (
    <button
      type="button"
      onClick={() => onClick?.(event)}
      className={cn(
        "absolute z-10 overflow-hidden rounded-md border px-2 py-1 text-left transition-opacity hover:opacity-90",
        colors.bg,
        colors.text,
        colors.border
      )}
      style={{ top: `${top}%`, height: `${height}%`, width, left }}
    >
      <div className="text-[11px] font-semibold leading-tight truncate">{event.title}</div>
      <div className="text-[10px] opacity-70">
        {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
      </div>
    </button>
  );
}
