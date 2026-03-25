"use client";

import { useRef, type ReactNode } from "react";
import { useDraggable } from "@dnd-kit/react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  id: string;
  children: ReactNode;
  onClick?: () => void;
}

export function KanbanCard({ id, children, onClick }: KanbanCardProps) {
  const { ref, isDragging } = useDraggable({ id });
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      ref={ref}
      className={cn(
        "cursor-grab rounded-xl border border-border bg-card p-3 shadow-sm transition-all active:cursor-grabbing",
        "hover:shadow-md",
        isDragging && "opacity-40 ring-2 ring-dashed ring-ring/30"
      )}
      onPointerDown={(e) => {
        pointerStart.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        if (!pointerStart.current || !onClick) return;
        const dx = Math.abs(e.clientX - pointerStart.current.x);
        const dy = Math.abs(e.clientY - pointerStart.current.y);
        if (dx < 5 && dy < 5) onClick();
        pointerStart.current = null;
      }}
    >
      {children}
    </div>
  );
}
