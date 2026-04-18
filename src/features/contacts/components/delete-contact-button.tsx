"use client";

import { useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteContactAndRedirectAction } from "@/features/contacts/actions";
import { toast } from "sonner";

interface DeleteContactButtonProps {
  contactId: string;
}

export function DeleteContactButton({ contactId }: DeleteContactButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteContactAndRedirectAction(contactId);
      } catch (error) {
        if (isRedirectError(error)) throw error;
        const message = error instanceof Error ? error.message : "削除に失敗しました";
        toast.error(message);
      }
    });
  }

  return (
    <>
      <Button type="button" variant="destructive" onClick={() => setOpen(true)} disabled={isPending}>
        {isPending ? "Deleting..." : "Delete"}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Contact を削除"
        description="この操作は取り消せません。本当に削除しますか？"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        destructive
      />
    </>
  );
}
