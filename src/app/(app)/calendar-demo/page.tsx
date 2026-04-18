import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { CalendarDemo } from "./calendar-demo";

export default async function CalendarDemoPage() {
  await requireAuthenticatedUser();

  return (
    <div>
      <div className="border-b border-border px-5 py-3.5">
        <h1 className="text-[21px] font-semibold tracking-[-0.022em]">Calendar</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">美容サロンサンプル / 予約管理</p>
      </div>
      <div className="p-5">
        <CalendarDemo />
      </div>
    </div>
  );
}
