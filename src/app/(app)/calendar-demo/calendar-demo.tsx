"use client";

import "temporal-polyfill/global";
import { Temporal } from "temporal-polyfill";
import { useState, useCallback } from "react";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { type CalendarEvent, viewWeek, viewDay, viewMonthGrid } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import "@schedule-x/theme-shadcn/dist/index.css";
import { addDays, startOfWeek } from "date-fns";
import { ja } from "date-fns/locale";
import { Clock, User, Scissors, CalendarDots } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { SidePanel, SidePanelHeader, SidePanelTitle, SidePanelContent } from "@/components/ui/side-panel";

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
      _staff: slot.staff,
      _service: slot.service,
      _customer: slot.customer,
      _duration: slot.duration,
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

function formatTime(dt: Temporal.ZonedDateTime | Temporal.PlainDate): string {
  if (dt instanceof Temporal.ZonedDateTime) {
    return `${String(dt.hour).padStart(2, "0")}:${String(dt.minute).padStart(2, "0")}`;
  }
  return "";
}

function formatDate(dt: Temporal.ZonedDateTime | Temporal.PlainDate): string {
  if (dt instanceof Temporal.ZonedDateTime) {
    return `${dt.year}/${dt.month}/${dt.day}`;
  }
  return `${dt.year}/${dt.month}/${dt.day}`;
}

export function CalendarDemo() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const eventsService = createEventsServicePlugin();
  const calendarControls = createCalendarControlsPlugin();

  const handleClose = useCallback(() => setSelectedEvent(null), []);

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
        nDays: 6,
        eventWidth: 100,
      },
      calendars: {
        tanaka: {
          colorName: "tanaka",
          label: "田中",
          lightColors: { main: "#2563eb", container: "#dbeafe", onContainer: "#1e40af" },
        },
        suzuki: {
          colorName: "suzuki",
          label: "鈴木",
          lightColors: { main: "#059669", container: "#d1fae5", onContainer: "#065f46" },
        },
        sato: {
          colorName: "sato",
          label: "佐藤",
          lightColors: { main: "#7c3aed", container: "#ede9fe", onContainer: "#5b21b6" },
        },
        yamada: {
          colorName: "yamada",
          label: "山田",
          lightColors: { main: "#d97706", container: "#fef3c7", onContainer: "#92400e" },
        },
      },
      callbacks: {
        onEventClick(event) {
          setSelectedEvent(event);
        },
        onClickDateTime(dateTime) {
          console.log("Slot clicked:", dateTime.toString());
        },
      },
    },
    [eventsService, calendarControls]
  );

  if (!calendar) return null;

  const staff = selectedEvent ? staffColors[selectedEvent._staff as string] : null;

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
      <div className="overflow-hidden rounded-xl border border-border">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>

      <SidePanel open={!!selectedEvent} onClose={handleClose} ariaLabel="予約詳細">
        <SidePanelHeader onClose={handleClose}>
          <SidePanelTitle>予約詳細</SidePanelTitle>
        </SidePanelHeader>
        <SidePanelContent>
          {selectedEvent && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">{selectedEvent.title}</h4>
                {staff && (
                  <Badge style={{ backgroundColor: staff.color, color: "#fff" }}>
                    {staff.label}
                  </Badge>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">顧客</p>
                    <p className="font-medium">{selectedEvent._customer as string}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Scissors className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">施術内容</p>
                    <p className="font-medium">{selectedEvent._service as string}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDots className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">日付</p>
                    <p className="font-medium">{formatDate(selectedEvent.start)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">時間</p>
                    <p className="font-medium">
                      {formatTime(selectedEvent.start)} ~ {formatTime(selectedEvent.end)}
                      <span className="ml-2 text-muted-foreground">({selectedEvent._duration as number}分)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
