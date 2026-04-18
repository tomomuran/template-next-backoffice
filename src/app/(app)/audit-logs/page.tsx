import { requireRole } from "@/lib/auth/require-user";
import { listAuditLogs } from "@/features/audit-logs/services/audit-log-list-service";
import { AuditLogTable } from "@/features/audit-logs/components/audit-log-table";

export default async function AuditLogsPage() {
  await requireRole(["admin"]);
  const logs = await listAuditLogs();

  return (
    <div>
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[21px] font-semibold tracking-[-0.022em]">Audit log</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              システム操作の履歴 / 直近 30 日
            </p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <AuditLogTable logs={logs} />
      </div>
    </div>
  );
}
