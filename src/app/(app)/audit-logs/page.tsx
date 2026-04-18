import { requireRole } from "@/lib/auth/require-user";
import { listAuditLogs } from "@/features/audit-logs/services/audit-log-list-service";
import { AuditLogTable } from "@/features/audit-logs/components/audit-log-table";

export default async function AuditLogsPage() {
  await requireRole(["admin"]);
  const logs = await listAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">システム操作の履歴を確認できます</p>
      </div>
      <AuditLogTable logs={logs} />
    </div>
  );
}
