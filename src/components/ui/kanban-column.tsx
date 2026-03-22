"use client";

import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/react";
import { Plus } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  label: string;
  accentColor?: string;
  count: number;
  onAddItem?: () => void;
  emptyMessage?: string;
  children: ReactNode;
}

export function KanbanColumn({ id, label, accentColor, count, onAddItem, emptyMessage, children }: KanbanColumnProps) {
  const { ref, isDropTarget } = useDroppable({ id });

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-w-[280px] shrink-0 flex-col rounded-xl bg-muted/40 transition-colors",
        isDropTarget && "bg-muted/80 ring-2 ring-ring/20"
      )}
    >
      <div className="flex items-center gap-2 p-3 pb-2">
        {accentColor && <div className={cn("h-5 w-1 rounded-full", accentColor)} />}
        <span className="text-sm font-semibold">{label}</span>
        <Badge variant="default" className="ml-auto">{count}</Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 pt-1">
        {count === 0 && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground">
            {emptyMessage ?? "アイテムなし"}
          </div>
        )}
        {children}
      </div>

      {onAddItem && (
        <button
          type="button"
          onClick={onAddItem}
          className="m-3 mt-0 flex items-center justify-center gap-1 rounded-lg border border-dashed border-border py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          追加
        </button>
      )}
    </div>
  );
}
