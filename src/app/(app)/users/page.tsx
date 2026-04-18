import { requireRole } from "@/lib/auth/require-user";
import { listUsers } from "@/features/users/services/users-service";
import { UsersTable } from "@/features/users/components/users-table";
import { InviteUserDialog } from "@/features/users/components/invite-user-dialog";

export default async function UsersPage() {
  await requireRole(["admin"]);
  const users = await listUsers();

  return (
    <div>
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[21px] font-semibold tracking-[-0.022em]">Members</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              ワークスペースのメンバー / ロール / ステータスを管理
            </p>
          </div>
          <InviteUserDialog />
        </div>
      </div>
      <div className="p-5">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
