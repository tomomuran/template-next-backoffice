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

function generateSampleEvents(): CalendarEvent[] {
  const today = new Date();
  const weekStart = startOfWeek(today, { locale: ja });
  const staffKeys = Object.keys(staffColorMap);
  const services = ["カット", "カラー", "パーマ", "トリートメント", "カット+カラー", "縮毛矯正"];
  const names = ["佐藤様", "鈴木様", "高橋様", "田中様", "伊藤様", "渡辺様", "山本様", "中村様", "小林様", "加藤様", "吉田様", "山田様"];

  const events: CalendarEvent[] = [];
  let id = 1;

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = addDays(weekStart, dayOffset);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) continue; // 日曜定休

    const numEvents = dayOfWeek === 6 ? 6 : 4; // 土曜は多め

    for (let i = 0; i < numEvents; i++) {
      const hour = 9 + Math.floor(Math.random() * 9); // 9:00 - 17:00
      const minute = Math.random() > 0.5 ? 0 : 30;
      const durationMinutes = [30, 60, 60, 90, 120, 150][Math.floor(Math.random() * services.length)];
      const staff = staffKeys[Math.floor(Math.random() * staffKeys.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const name = names[Math.floor(Math.random() * names.length)];

      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start.getTime() + durationMinutes * 60_000);

      if (end.getHours() > 20) continue;

      events.push({
        id: String(id++),
        title: `${name} ${service}`,
        start,
        end,
        colorKey: staff,
        meta: { staff, service, customer: name },
      });
    }
  }

  return events;
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
