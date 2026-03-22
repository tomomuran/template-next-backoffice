"use client";

import { getMonthDays } from "./calendar-utils";
import { CalendarMonthCell } from "./calendar-month-cell";
import type { CalendarEvent, CalendarColorMap } from "./calendar-types";
import type { ReactNode } from "react";

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

interface CalendarMonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  colorMap?: CalendarColorMap;
  onDateClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  renderEventChip?: (event: CalendarEvent) => ReactNode;
}

export function CalendarMonthView({
  currentDate,
  events,
  colorMap,
  onDateClick,
  onEventClick,
  renderEventChip,
}: CalendarMonthViewProps) {
  const days = getMonthDays(currentDate);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="border-r border-border px-2 py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date) => (
          <CalendarMonthCell
            key={date.toISOString()}
            date={date}
            currentMonth={currentDate}
            events={events}
            colorMap={colorMap}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            renderEventChip={renderEventChip}
          />
        ))}
      </div>
    </div>
  );
}
