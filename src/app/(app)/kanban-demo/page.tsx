import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { KanbanDemo } from "./kanban-demo";

export default async function KanbanDemoPage() {
  await requireAuthenticatedUser();

  return (
    <div>
      <div className="border-b border-border px-5 py-3.5">
        <h1 className="text-[21px] font-semibold tracking-[-0.022em]">Tasks</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">運営タスク / カンバンビュー</p>
      </div>
      <div className="p-5">
        <KanbanDemo />
      </div>
    </div>
  );
}
