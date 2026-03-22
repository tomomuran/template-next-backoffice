"use client";

import { useState, useCallback, useMemo } from "react";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import type { KanbanBoardProps, KanbanItem } from "./kanban-types";

export function KanbanBoard<TItem extends KanbanItem>({
  columns,
  items,
  renderCard,
  onDragEnd,
  onAddItem,
  emptyMessage,
}: KanbanBoardProps<TItem>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const itemsByStatus = useMemo(() => {
    const map = new Map<string, TItem[]>();
    for (const col of columns) {
      map.set(col.id, []);
    }
    for (const item of items) {
      const list = map.get(item.status);
      if (list) list.push(item);
    }
    return map;
  }, [columns, items]);

  const activeItem = useMemo(() => {
    if (!activeId) return null;
    return items.find((item) => item.id === activeId) ?? null;
  }, [activeId, items]);

  const handleDragEnd = useCallback(
    (event: { operation: { source: { id: unknown } | null; target: { id: unknown } | null }; canceled: boolean }) => {
      setActiveId(null);

      if (event.canceled) return;

      const sourceId = event.operation.source?.id;
      const targetId = event.operation.target?.id;

      if (!sourceId || !targetId) return;

      const draggedItem = items.find((item) => item.id === String(sourceId));
      if (!draggedItem) return;

      const toStatus = String(targetId) as TItem["status"];
      if (draggedItem.status === toStatus) return;

      onDragEnd({
        item: draggedItem,
        fromStatus: draggedItem.status,
        toStatus,
      });
    },
    [items, onDragEnd]
  );

  return (
    <DragDropProvider
      onDragStart={(event) => {
        const sourceId = event.operation.source?.id;
        if (sourceId) setActiveId(String(sourceId));
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none">
        {columns.map((col) => {
          const colItems = itemsByStatus.get(col.id) ?? [];
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              accentColor={col.accentColor}
              count={colItems.length}
              onAddItem={onAddItem ? () => onAddItem(col.id) : undefined}
              emptyMessage={emptyMessage}
            >
              {colItems.map((item) => (
                <KanbanCard key={item.id} id={item.id}>
                  {renderCard(item)}
                </KanbanCard>
              ))}
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="rounded-xl border border-border bg-card p-3 shadow-lg rotate-2 scale-[1.02]">
            {renderCard(activeItem)}
          </div>
        ) : null}
      </DragOverlay>
    </DragDropProvider>
  );
}
