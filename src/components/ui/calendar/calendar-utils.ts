import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
} from "date-fns";
import { ja } from "date-fns/locale";
import type { CalendarEvent, CalendarTimeRange, CalendarSlotDuration } from "./calendar-types";

export { format, isSameDay, isSameMonth, isToday, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays };

export const jaLocale = ja;

export function getMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calStart = startOfWeek(monthStart, { locale: ja });
  const calEnd = endOfWeek(monthEnd, { locale: ja });
  return eachDayOfInterval({ start: calStart, end: calEnd });
}

export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date, { locale: ja });
  const weekEnd = endOfWeek(date, { locale: ja });
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter((e) => isSameDay(e.start, date));
}

export function getEventsForDateRange(events: CalendarEvent[], start: Date, end: Date): CalendarEvent[] {
  return events.filter((e) => e.start >= start && e.start < end);
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}

export function getTimeSlots(date: Date, timeRange: CalendarTimeRange, slotDuration: CalendarSlotDuration): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let current = setMinutes(setHours(date, timeRange.startHour), 0);
  const end = setMinutes(setHours(date, timeRange.endHour), 0);

  while (current < end) {
    const slotEnd = new Date(current.getTime() + slotDuration.minutes * 60_000);
    slots.push({
      start: current,
      end: slotEnd > end ? end : slotEnd,
      label: format(current, "HH:mm"),
    });
    current = slotEnd;
  }

  return slots;
}

export function calculateEventPosition(
  event: CalendarEvent,
  timeRange: CalendarTimeRange
): { top: number; height: number } {
  const totalMinutes = (timeRange.endHour - timeRange.startHour) * 60;
  const startMinutes = (getHours(event.start) - timeRange.startHour) * 60 + getMinutes(event.start);
  const endMinutes = (getHours(event.end) - timeRange.startHour) * 60 + getMinutes(event.end);

  const top = Math.max(0, (startMinutes / totalMinutes) * 100);
  const height = Math.max(2, ((endMinutes - startMinutes) / totalMinutes) * 100);

  return { top, height };
}

interface PositionedEvent {
  event: CalendarEvent;
  column: number;
  totalColumns: number;
}

export function resolveOverlappingEvents(events: CalendarEvent[]): PositionedEvent[] {
  if (events.length === 0) return [];

  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const result: PositionedEvent[] = [];

  const clusters: CalendarEvent[][] = [];
  let currentCluster: CalendarEvent[] = [sorted[0]];
  let clusterEnd = sorted[0].end.getTime();

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start.getTime() < clusterEnd) {
      currentCluster.push(sorted[i]);
      clusterEnd = Math.max(clusterEnd, sorted[i].end.getTime());
    } else {
      clusters.push(currentCluster);
      currentCluster = [sorted[i]];
      clusterEnd = sorted[i].end.getTime();
    }
  }
  clusters.push(currentCluster);

  for (const cluster of clusters) {
    const columns: CalendarEvent[][] = [];

    for (const event of cluster) {
      let placed = false;
      for (let col = 0; col < columns.length; col++) {
        const lastInCol = columns[col][columns[col].length - 1];
        if (lastInCol.end.getTime() <= event.start.getTime()) {
          columns[col].push(event);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([event]);
      }
    }

    const totalColumns = columns.length;
    for (let col = 0; col < columns.length; col++) {
      for (const event of columns[col]) {
        result.push({ event, column: col, totalColumns });
      }
    }
  }

  return result;
}
