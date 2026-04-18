import { requireRole } from "@/lib/auth/require-user";
import { listUsers } from "@/features/users/services/users-service";
import { UsersTable } from "@/features/users/components/users-table";
import { InviteUserDialog } from "@/features/users/components/invite-user-dialog";

export default async function UsersPage() {
  await requireRole(["admin"]);
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">ユーザーの招待・ロール・ステータスを管理</p>
        </div>
        <InviteUserDialog />
      </div>
      <UsersTable users={users} />
    </div>
  );
}
