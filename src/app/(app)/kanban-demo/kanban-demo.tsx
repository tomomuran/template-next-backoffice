"use client";

import { useState, useCallback } from "react";
import { Buildings, MapPin, CurrencyJpy } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard } from "@/components/ui/kanban-board";
import type { KanbanColumnDefinition, KanbanItem, KanbanDragEndEvent } from "@/components/ui/kanban-types";

type PropertyStatus = "vacant" | "viewing_booked" | "viewed" | "applied" | "contracted";

interface Property extends KanbanItem<PropertyStatus> {
  name: string;
  address: string;
  rent: string;
  type: string;
  rooms: string;
}

const columns: KanbanColumnDefinition<PropertyStatus>[] = [
  { id: "vacant", label: "空室", accentColor: "bg-slate-400" },
  { id: "viewing_booked", label: "内覧予約", accentColor: "bg-blue-500" },
  { id: "viewed", label: "内覧済み", accentColor: "bg-violet-500" },
  { id: "applied", label: "申込", accentColor: "bg-amber-500" },
  { id: "contracted", label: "契約完了", accentColor: "bg-emerald-500" },
];

const initialProperties: Property[] = [
  { id: "1", status: "vacant", name: "パークハイツ渋谷 301", address: "渋谷区神南1-2-3", rent: "¥128,000", type: "1LDK", rooms: "35m2" },
  { id: "2", status: "vacant", name: "メゾン代官山 502", address: "渋谷区代官山町4-5", rent: "¥185,000", type: "2LDK", rooms: "52m2" },
  { id: "3", status: "viewing_booked", name: "グランドヒル目黒 201", address: "目黒区下目黒2-1", rent: "¥142,000", type: "1LDK", rooms: "40m2" },
  { id: "4", status: "viewing_booked", name: "リバーサイド中目黒 705", address: "目黒区中目黒3-8", rent: "¥198,000", type: "2LDK", rooms: "58m2" },
  { id: "5", status: "viewed", name: "コートレジデンス恵比寿 402", address: "渋谷区恵比寿南1-5", rent: "¥165,000", type: "1LDK", rooms: "42m2" },
  { id: "6", status: "applied", name: "ブリリア池袋 1203", address: "豊島区南池袋2-9", rent: "¥155,000", type: "2LDK", rooms: "55m2" },
  { id: "7", status: "contracted", name: "レジデンシア新宿 801", address: "新宿区西新宿5-3", rent: "¥172,000", type: "1LDK", rooms: "45m2" },
  { id: "8", status: "vacant", name: "プラウド三軒茶屋 104", address: "世田谷区三軒茶屋1-7", rent: "¥138,000", type: "1K", rooms: "28m2" },
  { id: "9", status: "viewed", name: "ザ・タワー品川 2501", address: "港区港南3-2", rent: "¥245,000", type: "2LDK", rooms: "65m2" },
  { id: "10", status: "applied", name: "シティテラス六本木 1501", address: "港区六本木4-6", rent: "¥320,000", type: "3LDK", rooms: "78m2" },
];

export function KanbanDemo() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  const handleDragEnd = useCallback((event: KanbanDragEndEvent<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === event.item.id ? { ...p, status: event.toStatus } : p))
    );
  }, []);

  const renderCard = useCallback((property: Property) => (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-tight">{property.name}</span>
        <Badge variant="secondary" className="shrink-0 text-[10px]">{property.type}</Badge>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="truncate">{property.address}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Buildings className="h-3 w-3" />
          {property.rooms}
        </span>
        <span className="flex items-center gap-0.5 font-semibold">
          <CurrencyJpy className="h-3 w-3" />
          {property.rent.replace("¥", "")}
        </span>
      </div>
    </div>
  ), []);

  return (
    <KanbanBoard
      columns={columns}
      items={properties}
      renderCard={renderCard}
      onDragEnd={handleDragEnd}
    />
  );
}
