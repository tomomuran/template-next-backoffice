"use client";

import { useState, useTransition } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_ROLES } from "@/lib/auth/roles";
import { inviteUserAction } from "@/features/users/actions";
import { toast } from "sonner";

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<(typeof APP_ROLES)[number]>("member");

  function handleSubmit() {
    startTransition(async () => {
      try {
        await inviteUserAction({ email, displayName, role });
        toast.success("招待メールを送信しました");
        setOpen(false);
        setEmail("");
        setDisplayName("");
        setRole("member");
      } catch (error) {
        const message = error instanceof Error ? error.message : "招待に失敗しました";
        toast.error(message);
      }
    });
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <Button type="button">Invite User</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-lg">
          <AlertDialog.Title className="text-lg font-semibold">Invite User</AlertDialog.Title>
          <AlertDialog.Description className="mt-1 text-sm text-muted-foreground">
            招待メールが送信されます
          </AlertDialog.Description>

          <div className="mt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="invite-email">Email</label>
              <Input
                id="invite-email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="invite-name">Display Name</label>
              <Input
                id="invite-name"
                placeholder="Taro Yamada"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="invite-role">Role</label>
              <select
                id="invite-role"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                value={role}
                onChange={(e) => setRole(e.target.value as (typeof APP_ROLES)[number])}
              >
                {APP_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted">
              Cancel
            </AlertDialog.Cancel>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !email || !displayName}
              className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
