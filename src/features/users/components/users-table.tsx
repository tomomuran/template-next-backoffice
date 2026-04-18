"use client";

import { useState } from "react";
import { Eye } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { DataTableFilterDefinition } from "@/components/ui/data-table-utils";
import { UserDetailPanel } from "@/features/users/components/user-detail-panel";
import type { UserRecord } from "@/features/users/services/users-service";

function statusVariant(status: string) {
  if (status === "active") return "success" as const;
  if (status === "suspended") return "danger" as const;
  return "warning" as const;
}

function roleVariant(role: string) {
  return role === "admin" ? "secondary" as const : "default" as const;
}

function buildColumns(onSelect: (user: UserRecord) => void): DataTableColumn<UserRecord>[] {
  return [
    {
      key: "display_name",
      header: "Name",
      sortable: true,
      getSortValue: (row) => row.display_name ?? "",
      getSearchValue: (row) => row.display_name ?? "",
      getCsvValue: (row) => row.display_name ?? "",
      render: (row) => <span className="text-sm font-medium">{row.display_name ?? "-"}</span>
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      getSortValue: (row) => row.email,
      getSearchValue: (row) => row.email,
      getCsvValue: (row) => row.email,
      render: (row) => <span className="text-sm">{row.email}</span>
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      getSortValue: (row) => row.role,
      getCsvValue: (row) => row.role,
      render: (row) => <Badge variant={roleVariant(row.role)}>{row.role}</Badge>
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      getSortValue: (row) => row.status,
      getCsvValue: (row) => row.status,
      render: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
    },
    {
      key: "created_at",
      header: "Created",
      sortable: true,
      getSortValue: (row) => row.created_at,
      getCsvValue: (row) => new Date(row.created_at).toLocaleDateString("ja-JP"),
      render: (row) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {new Date(row.created_at).toLocaleDateString("ja-JP")}
        </span>
      )
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

const filters: DataTableFilterDefinition<UserRecord>[] = [
  {
    key: "role",
    label: "Role",
    options: [
      { label: "Admin", value: "admin" },
      { label: "Member", value: "member" }
    ],
    getValue: (row) => row.role
  },
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Invited", value: "invited" },
      { label: "Suspended", value: "suspended" }
    ],
    getValue: (row) => row.status
  }
];

interface UsersTableProps {
  users: UserRecord[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const columns = buildColumns(setSelectedUser);

  return (
    <>
      <DataTable
        columns={columns}
        rows={users}
        emptyMessage="ユーザーがいません"
        filters={filters}
        initialSort={{ key: "created_at", direction: "desc" }}
        searchPlaceholder="Name, Email で検索"
        csvFileName="users.csv"
      />
      <UserDetailPanel user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  );
}
