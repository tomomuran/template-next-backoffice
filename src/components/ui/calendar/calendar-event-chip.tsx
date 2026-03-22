"use client";

import { cn } from "@/lib/utils";
import type { CalendarEvent, CalendarColorMap } from "./calendar-types";
import { format } from "./calendar-utils";

interface CalendarEventChipProps {
  event: CalendarEvent;
  colorMap?: CalendarColorMap;
  onClick?: (event: CalendarEvent) => void;
}

const defaultColors = { bg: "bg-chart-1/10", text: "text-chart-1", border: "border-chart-1/30" };

export function CalendarEventChip({ event, colorMap, onClick }: CalendarEventChipProps) {
  const colors = (event.colorKey && colorMap?.[event.colorKey]) || defaultColors;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      className={cn(
        "w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium leading-tight border transition-opacity hover:opacity-80",
        colors.bg,
        colors.text,
        colors.border
      )}
    >
      <span className="mr-1 text-[10px] opacity-70">{format(event.start, "HH:mm")}</span>
      {event.title}
    </button>
  );
}
