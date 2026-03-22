"use client";

import "temporal-polyfill/global";
import { Temporal } from "temporal-polyfill";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { type CalendarEvent, viewWeek, viewDay, viewMonthGrid } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import "@schedule-x/theme-shadcn/dist/index.css";
import { addDays, startOfWeek } from "date-fns";
import { ja } from "date-fns/locale";

interface SlotDef {
  dayOffset: number;
  hour: number;
  minute: number;
  duration: number;
  staff: string;
  service: string;
  customer: string;
}

const slotDefinitions: SlotDef[] = [
  { dayOffset: 1, hour: 9, minute: 0, duration: 60, staff: "tanaka", service: "カット", customer: "佐藤様" },
  { dayOffset: 1, hour: 10, minute: 30, duration: 90, staff: "suzuki", service: "カラー", customer: "鈴木様" },
  { dayOffset: 1, hour: 13, minute: 0, duration: 60, staff: "sato", service: "パーマ", customer: "高橋様" },
  { dayOffset: 1, hour: 15, minute: 0, duration: 30, staff: "yamada", service: "トリートメント", customer: "田中様" },
  { dayOffset: 2, hour: 9, minute: 30, duration: 60, staff: "suzuki", service: "カット+カラー", customer: "伊藤様" },
  { dayOffset: 2, hour: 11, minute: 0, duration: 120, staff: "tanaka", service: "縮毛矯正", customer: "渡辺様" },
  { dayOffset: 2, hour: 14, minute: 0, duration: 60, staff: "sato", service: "カット", customer: "山本様" },
  { dayOffset: 2, hour: 16, minute: 0, duration: 90, staff: "yamada", service: "カラー", customer: "中村様" },
  { dayOffset: 3, hour: 10, minute: 0, duration: 60, staff: "tanaka", service: "カット", customer: "小林様" },
  { dayOffset: 3, hour: 10, minute: 0, duration: 90, staff: "suzuki", service: "パーマ", customer: "加藤様" },
  { dayOffset: 3, hour: 13, minute: 30, duration: 60, staff: "sato", service: "カラー", customer: "吉田様" },
  { dayOffset: 3, hour: 15, minute: 30, duration: 30, staff: "yamada", service: "トリートメント", customer: "山田様" },
  { dayOffset: 4, hour: 9, minute: 0, duration: 90, staff: "sato", service: "カット+カラー", customer: "佐藤様" },
  { dayOffset: 4, hour: 11, minute: 0, duration: 60, staff: "tanaka", service: "カット", customer: "高橋様" },
  { dayOffset: 4, hour: 14, minute: 0, duration: 120, staff: "suzuki", service: "縮毛矯正", customer: "鈴木様" },
  { dayOffset: 4, hour: 17, minute: 0, duration: 60, staff: "yamada", service: "カラー", customer: "伊藤様" },
  { dayOffset: 5, hour: 9, minute: 0, duration: 60, staff: "yamada", service: "カット", customer: "渡辺様" },
  { dayOffset: 5, hour: 10, minute: 30, duration: 90, staff: "tanaka", service: "パーマ", customer: "山本様" },
  { dayOffset: 5, hour: 13, minute: 0, duration: 60, staff: "suzuki", service: "カット", customer: "中村様" },
  { dayOffset: 5, hour: 15, minute: 0, duration: 90, staff: "sato", service: "カラー", customer: "小林様" },
  { dayOffset: 6, hour: 9, minute: 0, duration: 60, staff: "tanaka", service: "カット", customer: "加藤様" },
  { dayOffset: 6, hour: 9, minute: 30, duration: 90, staff: "suzuki", service: "カット+カラー", customer: "吉田様" },
  { dayOffset: 6, hour: 11, minute: 0, duration: 60, staff: "sato", service: "カット", customer: "山田様" },
  { dayOffset: 6, hour: 13, minute: 0, duration: 120, staff: "yamada", service: "縮毛矯正", customer: "佐藤様" },
  { dayOffset: 6, hour: 14, minute: 0, duration: 60, staff: "tanaka", service: "カラー", customer: "田中様" },
  { dayOffset: 6, hour: 16, minute: 0, duration: 90, staff: "suzuki", service: "パーマ", customer: "高橋様" },
];

const CALENDAR_TIMEZONE = "Asia/Tokyo";

function toZonedDateTime(date: Date, hour: number, minute: number) {
  return Temporal.ZonedDateTime.from({
    timeZone: CALENDAR_TIMEZONE,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour,
    minute,
  });
}

function generateEvents(): CalendarEvent[] {
  const today = new Date();
  const weekStart = startOfWeek(today, { locale: ja });

  return slotDefinitions.map((slot, i) => {
    const date = addDays(weekStart, slot.dayOffset);
    const start = toZonedDateTime(date, slot.hour, slot.minute);
    const end = start.add({ minutes: slot.duration });

    return {
      id: String(i + 1),
      title: `${slot.customer} ${slot.service}`,
      start,
      end,
      calendarId: slot.staff,
    };
  });
}

const events = generateEvents();

const staffColors: Record<string, { label: string; color: string }> = {
  tanaka: { label: "田中", color: "#2563eb" },
  suzuki: { label: "鈴木", color: "#059669" },
  sato: { label: "佐藤", color: "#7c3aed" },
  yamada: { label: "山田", color: "#d97706" },
};

export function CalendarDemo() {
  const eventsService = createEventsServicePlugin();
  const calendarControls = createCalendarControlsPlugin();

  const calendar = useNextCalendarApp(
    {
      locale: "ja-JP",
      timezone: CALENDAR_TIMEZONE,
      defaultView: viewWeek.name,
      views: [viewWeek, viewDay, viewMonthGrid],
      events,
      dayBoundaries: {
        start: "09:00",
        end: "20:00",
      },
      weekOptions: {
        gridHeight: 600,
        nDays: 7,
        eventWidth: 95,
      },
      calendars: {
        tanaka: {
          colorName: "tanaka",
          label: "田中",
          lightColors: {
            main: "#2563eb",
            container: "#dbeafe",
            onContainer: "#1e40af",
          },
        },
        suzuki: {
          colorName: "suzuki",
          label: "鈴木",
          lightColors: {
            main: "#059669",
            container: "#d1fae5",
            onContainer: "#065f46",
          },
        },
        sato: {
          colorName: "sato",
          label: "佐藤",
          lightColors: {
            main: "#7c3aed",
            container: "#ede9fe",
            onContainer: "#5b21b6",
          },
        },
        yamada: {
          colorName: "yamada",
          label: "山田",
          lightColors: {
            main: "#d97706",
            container: "#fef3c7",
            onContainer: "#92400e",
          },
        },
      },
      callbacks: {
        onEventClick(event) {
          console.log("Event clicked:", event);
        },
        onClickDateTime(dateTime) {
          console.log("Slot clicked:", dateTime.toString());
        },
      },
    },
    [eventsService, calendarControls]
  );

  if (!calendar) return null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        {Object.entries(staffColors).map(([key, { label, color }]) => (
          <div key={key} className="flex items-center gap-1.5 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}
