import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { KanbanDemo } from "./kanban-demo";

export default async function KanbanDemoPage() {
  await requireAuthenticatedUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kanban Board</h1>
        <p className="text-sm text-muted-foreground">不動産サンプル｜物件パイプライン</p>
      </div>
      <KanbanDemo />
    </div>
  );
}
