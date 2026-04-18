"use client";

import { useState } from "react";
import { Eye } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { DataTableFilterDefinition } from "@/components/ui/data-table-utils";
import { SidePanel, SidePanelContent, SidePanelHeader, SidePanelTitle } from "@/components/ui/side-panel";
import type { AuditLogRecord } from "@/features/audit-logs/services/audit-log-list-service";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function ActionBadge({ action }: { action: string }) {
  const variant = action === "delete" ? "danger" : action === "create" ? "success" : "default";
  return <Badge variant={variant}>{action}</Badge>;
}

function buildColumns(onSelect: (log: AuditLogRecord) => void): DataTableColumn<AuditLogRecord>[] {
  return [
    {
      key: "occurred_at",
      header: "Date",
      sortable: true,
      getSortValue: (row) => row.occurred_at,
      getSearchValue: (row) => formatDate(row.occurred_at),
      getCsvValue: (row) => formatDate(row.occurred_at),
      render: (row) => <span className="text-sm tabular-nums">{formatDate(row.occurred_at)}</span>
    },
    {
      key: "actor",
      header: "Actor",
      sortable: true,
      getSortValue: (row) => row.actor_name ?? row.actor,
      getSearchValue: (row) => row.actor_name ?? row.actor,
      getCsvValue: (row) => row.actor_name ?? row.actor,
      render: (row) => <span className="text-sm">{row.actor_name ?? row.actor.slice(0, 8)}</span>
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      getSortValue: (row) => row.action,
      getCsvValue: (row) => row.action,
      render: (row) => <ActionBadge action={row.action} />
    },
    {
      key: "target_type",
      header: "Target",
      sortable: true,
      getSortValue: (row) => row.target_type,
      getSearchValue: (row) => row.target_type,
      getCsvValue: (row) => row.target_type,
      render: (row) => <span className="text-sm">{row.target_type}</span>
    },
    {
      key: "target_id",
      header: "Target ID",
      getSearchValue: (row) => row.target_id,
      getCsvValue: (row) => row.target_id,
      render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.target_id.slice(0, 8)}</span>
    },
    {
      key: "detail",
      header: "",
      render: (row) => (
        <Button type="button" variant="ghost" size="sm" onClick={() => onSelect(row)}>
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];
}

const filters: DataTableFilterDefinition<AuditLogRecord>[] = [
  {
    key: "action",
    label: "Action",
    options: [
      { label: "Create", value: "create" },
      { label: "Update", value: "update" },
      { label: "Delete", value: "delete" }
    ],
    getValue: (row) => row.action
  },
  {
    key: "target_type",
    label: "Target Type",
    options: [
      { label: "Contact", value: "contact" },
      { label: "User Profile", value: "user_profile" }
    ],
    getValue: (row) => row.target_type
  }
];

function JsonDiff({ label, data }: { label: string; data: Record<string, unknown> | null }) {
  if (!data) return null;

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <pre className="max-h-64 overflow-auto rounded-md bg-muted/50 p-3 text-xs leading-relaxed">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

interface AuditLogTableProps {
  logs: AuditLogRecord[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);
  const columns = buildColumns(setSelectedLog);

  return (
    <>
      <DataTable
        columns={columns}
        rows={logs}
        emptyMessage="監査ログがありません"
        filters={filters}
        initialSort={{ key: "occurred_at", direction: "desc" }}
        searchPlaceholder="Actor, Target で検索"
        csvFileName="audit-logs.csv"
      />

      <SidePanel open={selectedLog !== null} onClose={() => setSelectedLog(null)} ariaLabel="監査ログ詳細">
        {selectedLog && (
          <>
            <SidePanelHeader onClose={() => setSelectedLog(null)}>
              <SidePanelTitle>Audit Log Detail</SidePanelTitle>
            </SidePanelHeader>
            <SidePanelContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p>{formatDate(selectedLog.occurred_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Action</p>
                    <ActionBadge action={selectedLog.action} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Actor</p>
                    <p>{selectedLog.actor_name ?? selectedLog.actor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target Type</p>
                    <p>{selectedLog.target_type}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Target ID</p>
                    <p className="font-mono text-xs">{selectedLog.target_id}</p>
                  </div>
                </div>

                <hr className="border-border" />

                <JsonDiff label="Before" data={selectedLog.before} />
                <JsonDiff label="After" data={selectedLog.after} />
              </div>
            </SidePanelContent>
          </>
        )}
      </SidePanel>
    </>
  );
}
