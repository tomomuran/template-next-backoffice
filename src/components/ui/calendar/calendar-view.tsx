"use client";

import { useState, useCallback } from "react";
import { CalendarToolbar } from "./calendar-toolbar";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarWeekView } from "./calendar-week-view";
import { CalendarDayView } from "./calendar-day-view";
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "./calendar-utils";
import { cn } from "@/lib/utils";
import type { CalendarViewMode, CalendarViewProps } from "./calendar-types";

const DEFAULT_TIME_RANGE = { startHour: 9, endHour: 20 };
const DEFAULT_SLOT_DURATION = { minutes: 30 };

export function CalendarView({
  events,
  timeRange = DEFAULT_TIME_RANGE,
  slotDuration = DEFAULT_SLOT_DURATION,
  colorMap,
  defaultView = "week",
  defaultDate,
  onSlotClick,
  onEventClick,
  renderEventChip,
  renderTimeEvent,
  className,
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<CalendarViewMode>(defaultView);
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate ?? new Date());

  const handleNavigate = useCallback(
    (direction: "prev" | "next" | "today") => {
      if (direction === "today") {
        setCurrentDate(new Date());
        return;
      }
      setCurrentDate((prev) => {
        const navigators = {
          month: { prev: subMonths, next: addMonths },
          week: { prev: subWeeks, next: addWeeks },
          day: { prev: subDays, next: addDays },
        };
        return navigators[viewMode][direction](prev, 1);
      });
    },
    [viewMode]
  );

  const handleDateClick = useCallback((date: Date) => {
    setCurrentDate(date);
    setViewMode("day");
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <CalendarToolbar
        currentDate={currentDate}
        viewMode={viewMode}
        onNavigate={handleNavigate}
        onViewChange={setViewMode}
      />

      {viewMode === "month" && (
        <CalendarMonthView
          currentDate={currentDate}
          events={events}
          colorMap={colorMap}
          onDateClick={handleDateClick}
          onEventClick={onEventClick}
          renderEventChip={renderEventChip}
        />
      )}

      {viewMode === "week" && (
        <CalendarWeekView
          currentDate={currentDate}
          events={events}
          timeRange={timeRange}
          slotDuration={slotDuration}
          colorMap={colorMap}
          onSlotClick={onSlotClick}
          onEventClick={onEventClick}
          renderTimeEvent={renderTimeEvent}
        />
      )}

      {viewMode === "day" && (
        <CalendarDayView
          currentDate={currentDate}
          events={events}
          timeRange={timeRange}
          slotDuration={slotDuration}
          colorMap={colorMap}
          onSlotClick={onSlotClick}
          onEventClick={onEventClick}
          renderTimeEvent={renderTimeEvent}
        />
      )}
    </div>
  );
}
