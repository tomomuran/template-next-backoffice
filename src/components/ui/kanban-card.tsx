"use client";

import type { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  id: string;
  children: ReactNode;
}

export function KanbanCard({ id, children }: KanbanCardProps) {
  const { ref, isDragging } = useDraggable({ id });

  return (
    <div
      ref={ref}
      className={cn(
        "cursor-grab rounded-xl border border-border bg-card p-3 shadow-sm transition-all active:cursor-grabbing",
        "hover:shadow-md",
        isDragging && "opacity-40 ring-2 ring-dashed ring-ring/30"
      )}
    >
      {children}
    </div>
  );
}
