"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SquaresFour,
  Users,
  Plus,
  Kanban,
  CalendarDots,
  UsersThree,
  Gear,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useCurrentUser } from "@/components/providers/auth-provider";
import { primarySampleFeature } from "@/lib/sample-features";

interface CommandItem {
  icon: typeof SquaresFour;
  label: string;
  shortcut?: string;
  href?: string;
  adminOnly?: boolean;
}

const allItems: CommandItem[] = [
  { icon: SquaresFour, label: "ダッシュボードを開く", href: "/dashboard" },
  { icon: Users, label: "コンタクトを開く", href: primarySampleFeature.href },
  { icon: Plus, label: "新規コンタクトを作成", href: primarySampleFeature.newHref },
  { icon: Kanban, label: "タスクボードを開く", href: "/kanban-demo" },
  { icon: CalendarDots, label: "カレンダーを開く", href: "/calendar-demo" },
  { icon: UsersThree, label: "メンバーを開く", href: "/users", adminOnly: true },
  { icon: Gear, label: "設定を開く", href: "/account" },
];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = allItems.filter((item) => !item.adminOnly || isAdmin);
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  function navigate(href?: string) {
    if (href) {
      router.push(href as "/dashboard");
      onClose();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      navigate(filtered[activeIndex].href);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[140px] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[560px] overflow-hidden rounded-xl border border-border bg-background shadow-[0_30px_80px_rgba(0,0,0,.2),0_0_0_1px_rgba(0,0,0,.02)]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <MagnifyingGlass size={14} className="text-muted-foreground" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="検索、またはコマンド..."
            className="flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border px-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[10.5px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="p-1.5">
          <div className="px-2.5 pb-0.5 pt-1.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Actions
          </div>
          {filtered.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-[13px] ${
                  i === activeIndex ? "bg-surface-2" : ""
                }`}
              >
                <Icon size={14} className="text-muted-foreground" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10.5px] text-muted-foreground">
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-2.5 py-4 text-center text-[13px] text-muted-foreground">
              結果なし
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
