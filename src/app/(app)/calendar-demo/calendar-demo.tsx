"use client";

import { useMemo } from "react";
import { CalendarView } from "@/components/ui/calendar";
import type { CalendarEvent, CalendarColorMap } from "@/components/ui/calendar";
import { addDays, startOfWeek } from "date-fns";
import { ja } from "date-fns/locale";

const staffColorMap: CalendarColorMap = {
  tanaka: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  suzuki: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  sato: { bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200" },
  yamada: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
};

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
  // 月曜 (dayOffset 1)
  { dayOffset: 1, hour: 9, minute: 0, duration: 60, staff: "tanaka", service: "カット", customer: "佐藤様" },
  { dayOffset: 1, hour: 10, minute: 30, duration: 90, staff: "suzuki", service: "カラー", customer: "鈴木様" },
  { dayOffset: 1, hour: 13, minute: 0, duration: 60, staff: "sato", service: "パーマ", customer: "高橋様" },
  { dayOffset: 1, hour: 15, minute: 0, duration: 30, staff: "yamada", service: "トリートメント", customer: "田中様" },
  // 火曜 (dayOffset 2)
  { dayOffset: 2, hour: 9, minute: 30, duration: 60, staff: "suzuki", service: "カット+カラー", customer: "伊藤様" },
  { dayOffset: 2, hour: 11, minute: 0, duration: 120, staff: "tanaka", service: "縮毛矯正", customer: "渡辺様" },
  { dayOffset: 2, hour: 14, minute: 0, duration: 60, staff: "sato", service: "カット", customer: "山本様" },
  { dayOffset: 2, hour: 16, minute: 0, duration: 90, staff: "yamada", service: "カラー", customer: "中村様" },
  // 水曜 (dayOffset 3)
  { dayOffset: 3, hour: 10, minute: 0, duration: 60, staff: "tanaka", service: "カット", customer: "小林様" },
  { dayOffset: 3, hour: 10, minute: 0, duration: 90, staff: "suzuki", service: "パーマ", customer: "加藤様" },
  { dayOffset: 3, hour: 13, minute: 30, duration: 60, staff: "sato", service: "カラー", customer: "吉田様" },
  { dayOffset: 3, hour: 15, minute: 30, duration: 30, staff: "yamada", service: "トリートメント", customer: "山田様" },
  // 木曜 (dayOffset 4)
  { dayOffset: 4, hour: 9, minute: 0, duration: 90, staff: "sato", service: "カット+カラー", customer: "佐藤様" },
  { dayOffset: 4, hour: 11, minute: 0, duration: 60, staff: "tanaka", service: "カット", customer: "高橋様" },
  { dayOffset: 4, hour: 14, minute: 0, duration: 120, staff: "suzuki", service: "縮毛矯正", customer: "鈴木様" },
  { dayOffset: 4, hour: 17, minute: 0, duration: 60, staff: "yamada", service: "カラー", customer: "伊藤様" },
  // 金曜 (dayOffset 5)
  { dayOffset: 5, hour: 9, minute: 0, duration: 60, staff: "yamada", service: "カット", customer: "渡辺様" },
  { dayOffset: 5, hour: 10, minute: 30, duration: 90, staff: "tanaka", service: "パーマ", customer: "山本様" },
  { dayOffset: 5, hour: 13, minute: 0, duration: 60, staff: "suzuki", service: "カット", customer: "中村様" },
  { dayOffset: 5, hour: 15, minute: 0, duration: 90, staff: "sato", service: "カラー", customer: "小林様" },
  // 土曜 (dayOffset 6) -- 多め
  { dayOffset: 6, hour: 9, minute: 0, duration: 60, staff: "tanaka", service: "カット", customer: "加藤様" },
  { dayOffset: 6, hour: 9, minute: 30, duration: 90, staff: "suzuki", service: "カット+カラー", customer: "吉田様" },
  { dayOffset: 6, hour: 11, minute: 0, duration: 60, staff: "sato", service: "カット", customer: "山田様" },
  { dayOffset: 6, hour: 13, minute: 0, duration: 120, staff: "yamada", service: "縮毛矯正", customer: "佐藤様" },
  { dayOffset: 6, hour: 14, minute: 0, duration: 60, staff: "tanaka", service: "カラー", customer: "田中様" },
  { dayOffset: 6, hour: 16, minute: 0, duration: 90, staff: "suzuki", service: "パーマ", customer: "高橋様" },
];

function generateSampleEvents(): CalendarEvent[] {
  const today = new Date();
  const weekStart = startOfWeek(today, { locale: ja });

  return slotDefinitions.map((slot, i) => {
    const date = addDays(weekStart, slot.dayOffset);
    const start = new Date(date);
    start.setHours(slot.hour, slot.minute, 0, 0);
    const end = new Date(start.getTime() + slot.duration * 60_000);

    return {
      id: String(i + 1),
      title: `${slot.customer} ${slot.service}`,
      start,
      end,
      colorKey: slot.staff,
      meta: { staff: slot.staff, service: slot.service, customer: slot.customer },
    };
  });
}

export function CalendarDemo() {
  const events = useMemo(() => generateSampleEvents(), []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        {Object.entries(staffColorMap).map(([key, colors]) => (
          <div key={key} className="flex items-center gap-1.5 text-sm">
            <span className={`h-3 w-3 rounded-full ${colors.bg} border ${colors.border}`} />
            <span className="text-muted-foreground capitalize">{key}</span>
          </div>
        ))}
      </div>
      <CalendarView
        events={events}
        colorMap={staffColorMap}
        defaultView="week"
        timeRange={{ startHour: 9, endHour: 20 }}
        slotDuration={{ minutes: 30 }}
        onEventClick={(event) => {
          console.log("Event clicked:", event);
        }}
        onSlotClick={(start, end) => {
          console.log("Slot clicked:", start, end);
        }}
      />
    </div>
  );
}
