import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { CalendarDemo } from "./calendar-demo";

export default async function CalendarDemoPage() {
  await requireAuthenticatedUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">美容サロンサンプル -- 予約管理</p>
      </div>
      <CalendarDemo />
    </div>
  );
}
