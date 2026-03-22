"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  getTimeSlots,
  getEventsForDate,
  resolveOverlappingEvents,
  calculateEventPosition,
  isToday,
  format,
  jaLocale,
} from "./calendar-utils";
import { CalendarTimeEvent } from "./calendar-time-event";
import type { CalendarEvent, CalendarTimeRange, CalendarSlotDuration, CalendarColorMap } from "./calendar-types";
import type { ReactNode } from "react";

interface CalendarTimeGridProps {
  dates: Date[];
  events: CalendarEvent[];
  timeRange: CalendarTimeRange;
  slotDuration: CalendarSlotDuration;
  colorMap?: CalendarColorMap;
  onSlotClick?: (start: Date, end: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  renderTimeEvent?: (event: CalendarEvent) => ReactNode;
}

export function CalendarTimeGrid({
  dates,
  events,
  timeRange,
  slotDuration,
  colorMap,
  onSlotClick,
  onEventClick,
  renderTimeEvent,
}: CalendarTimeGridProps) {
  const slots = useMemo(() => getTimeSlots(dates[0], timeRange, slotDuration), [dates, timeRange, slotDuration]);

  const eventsByDate = useMemo(() => {
    return dates.map((date) => {
      const dayEvents = getEventsForDate(events, date);
      return resolveOverlappingEvents(dayEvents);
    });
  }, [dates, events]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Day headers */}
      <div
        className="grid border-b border-border"
        style={{ gridTemplateColumns: `60px repeat(${dates.length}, 1fr)` }}
      >
        <div className="border-r border-border" />
        {dates.map((date) => (
          <div
            key={date.toISOString()}
            className={cn(
              "border-r border-border px-2 py-2 text-center last:border-r-0",
              isToday(date) && "bg-foreground/5"
            )}
          >
            <div className="text-xs text-muted-foreground">
              {format(date, "E", { locale: jaLocale })}
            </div>
            <div
              className={cn(
                "mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                isToday(date) && "bg-foreground text-background"
              )}
            >
              {format(date, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="relative max-h-[600px] overflow-y-auto">
        <div
          className="grid"
          style={{ gridTemplateColumns: `60px repeat(${dates.length}, 1fr)` }}
        >
          {/* Time labels + slot rows */}
          {slots.map((slot, si) => (
            <div key={slot.label} className="contents">
              {/* Time label */}
              <div className="border-b border-r border-border px-2 py-2 text-right text-xs text-muted-foreground">
                {si % 2 === 0 ? slot.label : ""}
              </div>
              {/* Day columns */}
              {dates.map((date, di) => {
                const slotStart = new Date(date);
                slotStart.setHours(slot.start.getHours(), slot.start.getMinutes(), 0, 0);
                const slotEnd = new Date(date);
                slotEnd.setHours(slot.end.getHours(), slot.end.getMinutes(), 0, 0);

                return (
                  <div
                    key={`${date.toISOString()}-${slot.label}`}
                    className={cn(
                      "border-b border-r border-border last:border-r-0 cursor-pointer transition-colors hover:bg-muted/30",
                      isToday(date) && "bg-foreground/[0.02]",
                      si % 2 === 0 && "border-b-border",
                      si % 2 !== 0 && "border-b-border/50"
                    )}
                    style={{ height: 28 }}
                    onClick={() => onSlotClick?.(slotStart, slotEnd)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Positioned events overlay */}
        <div
          className="pointer-events-none absolute inset-0 grid"
          style={{
            gridTemplateColumns: `60px repeat(${dates.length}, 1fr)`,
            top: 0,
          }}
        >
          <div />
          {dates.map((date, di) => (
            <div key={date.toISOString()} className="relative pointer-events-auto">
              {eventsByDate[di].map(({ event, column, totalColumns }) =>
                renderTimeEvent ? (
                  <div key={event.id} className="absolute z-10" style={{
                    top: `${calculateEventPosition(event, timeRange).top}%`,
                    height: `${calculateEventPosition(event, timeRange).height}%`,
                    width: `calc(${100 / totalColumns}% - 2px)`,
                    left: `calc(${(column / totalColumns) * 100}% + 1px)`,
                  }}>
                    {renderTimeEvent(event)}
                  </div>
                ) : (
                  <CalendarTimeEvent
                    key={event.id}
                    event={event}
                    timeRange={timeRange}
                    colorMap={colorMap}
                    column={column}
                    totalColumns={totalColumns}
                    onClick={onEventClick}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
