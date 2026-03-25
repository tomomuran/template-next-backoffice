import type { ReactNode } from "react";

export interface KanbanColumnDefinition<TStatus extends string = string> {
  id: TStatus;
  label: string;
  accentColor?: string;
}

export interface KanbanItem<TStatus extends string = string> {
  id: string;
  status: TStatus;
}

export interface KanbanDragEndEvent<TItem extends KanbanItem> {
  item: TItem;
  fromStatus: TItem["status"];
  toStatus: TItem["status"];
}

export interface KanbanBoardProps<TItem extends KanbanItem> {
  columns: KanbanColumnDefinition<TItem["status"]>[];
  items: TItem[];
  renderCard: (item: TItem) => ReactNode;
  onDragEnd: (event: KanbanDragEndEvent<TItem>) => void | Promise<void>;
  onItemClick?: (item: TItem) => void;
  onAddItem?: (status: TItem["status"]) => void;
  emptyMessage?: string;
}
