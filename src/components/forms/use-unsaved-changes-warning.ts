"use client";

import { useEffect } from "react";
import { DEFAULT_UNSAVED_CHANGES_MESSAGE, shouldWarnAboutUnsavedChanges } from "@/components/forms/unsaved-changes";

export function useUnsavedChangesWarning(isDirty: boolean, isPending: boolean, message = DEFAULT_UNSAVED_CHANGES_MESSAGE) {
  const enabled = shouldWarnAboutUnsavedChanges(isDirty, isPending);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = message;
      return message;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, message]);

  function confirmDiscardChanges() {
    if (!enabled) {
      return true;
    }

    return window.confirm(message);
  }

  return {
    shouldWarn: enabled,
    confirmDiscardChanges
  };
}
