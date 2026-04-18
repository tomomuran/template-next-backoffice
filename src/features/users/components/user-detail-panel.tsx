"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidePanel, SidePanelContent, SidePanelHeader, SidePanelTitle } from "@/components/ui/side-panel";
import { APP_ROLES, USER_STATUSES, type AppRole, type UserStatus } from "@/lib/auth/roles";
import { useCurrentUser } from "@/components/providers/auth-provider";
import { updateUserRoleAction, updateUserStatusAction } from "@/features/users/actions";
import type { UserRecord } from "@/features/users/services/users-service";
import { toast } from "sonner";

function statusVariant(status: string) {
  if (status === "active") return "success" as const;
  if (status === "suspended") return "danger" as const;
  return "warning" as const;
}

function roleVariant(role: string) {
  return role === "admin" ? "secondary" as const : "default" as const;
}

interface UserDetailPanelProps {
  user: UserRecord | null;
  onClose: () => void;
}

export function UserDetailPanel({ user, onClose }: UserDetailPanelProps) {
  const currentUser = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const isSelf = currentUser?.id === user?.id;

  function handleRoleChange(role: AppRole) {
    if (!user) return;
    startTransition(async () => {
      try {
        await updateUserRoleAction(user.id, role);
        toast.success("ロールを変更しました");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "変更に失敗しました");
      }
    });
  }

  function handleStatusChange(status: UserStatus) {
    if (!user) return;
    startTransition(async () => {
      try {
        await updateUserStatusAction(user.id, status);
        toast.success("ステータスを変更しました");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "変更に失敗しました");
      }
    });
  }

  return (
    <SidePanel open={user !== null} onClose={onClose} ariaLabel="ユーザー詳細">
      {user && (
        <>
          <SidePanelHeader onClose={onClose}>
            <SidePanelTitle>{user.display_name ?? user.email}</SidePanelTitle>
          </SidePanelHeader>
          <SidePanelContent>
            <div className="space-y-6">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <Badge variant={roleVariant(user.role)}>{user.role}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={statusVariant(user.status)}>{user.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="tabular-nums">{new Date(user.created_at).toLocaleString("ja-JP")}</p>
                </div>
              </div>

              {!isSelf && (
                <>
                  <hr className="border-border" />

                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</p>
                    <div className="flex gap-2">
                      {APP_ROLES.map((r) => (
                        <Button
                          key={r}
                          type="button"
                          variant={user.role === r ? "default" : "outline"}
                          size="sm"
                          disabled={isPending || user.role === r}
                          onClick={() => handleRoleChange(r)}
                        >
                          {r}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</p>
                    <div className="flex gap-2">
                      {USER_STATUSES.map((s) => (
                        <Button
                          key={s}
                          type="button"
                          variant={user.status === s ? "default" : "outline"}
                          size="sm"
                          disabled={isPending || user.status === s}
                          onClick={() => handleStatusChange(s)}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </SidePanelContent>
        </>
      )}
    </SidePanel>
  );
}
