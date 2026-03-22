"use client";

import { cn } from "@/lib/utils";
import { isSameMonth, isToday, format, getEventsForDate } from "./calendar-utils";
import { CalendarEventChip } from "./calendar-event-chip";
import type { CalendarEvent, CalendarColorMap } from "./calendar-types";
import type { ReactNode } from "react";

const MAX_VISIBLE_EVENTS = 3;

interface CalendarMonthCellProps {
  date: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  colorMap?: CalendarColorMap;
  onDateClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  renderEventChip?: (event: CalendarEvent) => ReactNode;
}

export function CalendarMonthCell({
  date,
  currentMonth,
  events,
  colorMap,
  onDateClick,
  onEventClick,
  renderEventChip,
}: CalendarMonthCellProps) {
  const dayEvents = getEventsForDate(events, date);
  const inMonth = isSameMonth(date, currentMonth);
  const today = isToday(date);
  const overflow = dayEvents.length - MAX_VISIBLE_EVENTS;

  return (
    <div
      className={cn(
        "min-h-[100px] border-b border-r border-border p-1 transition-colors hover:bg-muted/30 cursor-pointer",
        !inMonth && "bg-muted/10 text-muted-foreground/50"
      )}
      onClick={() => onDateClick(date)}
    >
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
          today && "bg-foreground text-background",
          !today && inMonth && "text-foreground",
        )}
      >
        {format(date, "d")}
      </span>
      <div className="mt-0.5 space-y-0.5">
        {dayEvents.slice(0, MAX_VISIBLE_EVENTS).map((event) =>
          renderEventChip ? (
            <div key={event.id}>{renderEventChip(event)}</div>
          ) : (
            <CalendarEventChip
              key={event.id}
              event={event}
              colorMap={colorMap}
              onClick={onEventClick}
            />
          )
        )}
        {overflow > 0 && (
          <span className="block text-[10px] text-muted-foreground pl-1">
            +{overflow} 件
          </span>
        )}
      </div>
    </div>
  );
}
