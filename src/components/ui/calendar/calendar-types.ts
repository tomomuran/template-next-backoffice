import type { ReactNode } from "react";

export type CalendarViewMode = "month" | "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  colorKey?: string;
  meta?: Record<string, unknown>;
}

export interface CalendarColorMap {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface CalendarTimeRange {
  startHour: number;
  endHour: number;
}

export interface CalendarSlotDuration {
  minutes: number;
}

export interface CalendarViewProps {
  events: CalendarEvent[];
  timeRange?: CalendarTimeRange;
  slotDuration?: CalendarSlotDuration;
  colorMap?: CalendarColorMap;
  defaultView?: CalendarViewMode;
  defaultDate?: Date;
  onSlotClick?: (start: Date, end: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  renderEventChip?: (event: CalendarEvent) => ReactNode;
  renderTimeEvent?: (event: CalendarEvent) => ReactNode;
  className?: string;
}
