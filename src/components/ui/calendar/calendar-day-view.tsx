"use client";

import { useMemo } from "react";
import { CalendarTimeGrid } from "./calendar-time-grid";
import type { CalendarEvent, CalendarTimeRange, CalendarSlotDuration, CalendarColorMap } from "./calendar-types";
import type { ReactNode } from "react";

interface CalendarDayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  timeRange: CalendarTimeRange;
  slotDuration: CalendarSlotDuration;
  colorMap?: CalendarColorMap;
  onSlotClick?: (start: Date, end: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  renderTimeEvent?: (event: CalendarEvent) => ReactNode;
}

export function CalendarDayView({
  currentDate,
  events,
  timeRange,
  slotDuration,
  colorMap,
  onSlotClick,
  onEventClick,
  renderTimeEvent,
}: CalendarDayViewProps) {
  const days = useMemo(() => [currentDate], [currentDate]);

  return (
    <CalendarTimeGrid
      dates={days}
      events={events}
      timeRange={timeRange}
      slotDuration={slotDuration}
      colorMap={colorMap}
      onSlotClick={onSlotClick}
      onEventClick={onEventClick}
      renderTimeEvent={renderTimeEvent}
    />
  );
}
