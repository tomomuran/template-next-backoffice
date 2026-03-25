"use client";

import { useEffect, useCallback, type ComponentProps, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  width?: string;
  children: ReactNode;
  ariaLabel?: string;
}

export function SidePanel({ open, onClose, width = "w-[400px]", children, ariaLabel = "詳細パネル" }: SidePanelProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-200",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* panel */}
      <div
        className={cn(
          "absolute right-0 top-0 flex h-full flex-col border-l border-border bg-card shadow-xl transition-transform duration-200",
          width,
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function SidePanelHeader({ className, children, onClose, ...props }: ComponentProps<"div"> & { onClose?: () => void }) {
  return (
    <div className={cn("flex items-center justify-between border-b border-border px-5 py-4", className)} {...props}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function SidePanelTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("text-base font-semibold", className)} {...props} />;
}

export function SidePanelContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex-1 overflow-y-auto px-5 py-4", className)} {...props} />;
}

export function SidePanelFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("border-t border-border px-5 py-4", className)} {...props} />;
}
