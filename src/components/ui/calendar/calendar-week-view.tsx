"use client";

import { useMemo } from "react";
import { getWeekDays } from "./calendar-utils";
import { CalendarTimeGrid } from "./calendar-time-grid";
import type { CalendarEvent, CalendarTimeRange, CalendarSlotDuration, CalendarColorMap } from "./calendar-types";
import type { ReactNode } from "react";

interface CalendarWeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  timeRange: CalendarTimeRange;
  slotDuration: CalendarSlotDuration;
  colorMap?: CalendarColorMap;
  onSlotClick?: (start: Date, end: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  renderTimeEvent?: (event: CalendarEvent) => ReactNode;
}

export function CalendarWeekView({
  currentDate,
  events,
  timeRange,
  slotDuration,
  colorMap,
  onSlotClick,
  onEventClick,
}: CalendarWeekViewProps) {
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  return (
    <CalendarTimeGrid
      dates={days}
      events={events}
      timeRange={timeRange}
      slotDuration={slotDuration}
      colorMap={colorMap}
      onSlotClick={onSlotClick}
      onEventClick={onEventClick}
    />
  );
}
