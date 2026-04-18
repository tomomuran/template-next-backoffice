"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Users,
  UsersThree,
  Kanban,
  CalendarDots,
  ClockCounterClockwise,
  Gear,
  MagnifyingGlass,
  CaretDown,
  SignOut,
} from "@phosphor-icons/react";
import { useCurrentUser } from "@/components/providers/auth-provider";
import { signOutAction } from "@/features/auth/actions";
import { primarySampleFeature } from "@/lib/sample-features";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
  shortcut?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded border border-border bg-surface-2 px-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] leading-[1.4] tracking-wide text-muted-foreground">
      {children}
    </kbd>
  );
}

export function AppSidebar({ onOpenCmdk }: { onOpenCmdk?: () => void }) {
  const currentPath = usePathname();
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";

  const sections: NavSection[] = [
    {
      label: "Workspace",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: SquaresFour, shortcut: "G D" },
      ],
    },
    {
      label: "Records",
      items: [
        { href: primarySampleFeature.href, label: primarySampleFeature.label, icon: Users, count: 128, shortcut: "G C" },
        { href: "/kanban-demo", label: "Tasks", icon: Kanban, shortcut: "G T" },
        { href: "/calendar-demo", label: "Calendar", icon: CalendarDots, shortcut: "G L" },
      ],
    },
    {
      label: "Admin",
      items: [
        ...(isAdmin ? [
          { href: "/users", label: "Members", icon: UsersThree },
          { href: "/audit-logs", label: "Audit log", icon: ClockCounterClockwise },
        ] : []),
        { href: "/account", label: "Settings", icon: Gear },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Workspace switcher */}
      <div className="px-3 pb-2 pt-3">
        <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-2">
          <div className="grid h-[22px] w-[22px] place-items-center rounded-[5px] bg-foreground text-background">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" opacity=".55" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" opacity=".55" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" />
            </svg>
          </div>
          <span className="flex-1 text-left text-sm font-medium">Backoffice</span>
          <CaretDown size={13} className="text-muted-foreground" />
        </button>

        {/* Search */}
        <button
          onClick={onOpenCmdk}
          className="mt-2 flex w-full items-center gap-2 rounded-md border border-border bg-surface-2 px-2 py-1.5 text-[13px] text-muted-foreground hover:border-muted-foreground/30"
        >
          <MagnifyingGlass size={13} />
          <span className="flex-1 text-left">検索...</span>
          <Kbd>⌘K</Kbd>
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-1.5 pb-3 pt-1">
        {sections.map((section, si) => (
          <div key={section.label} className={si === 0 ? "mt-1" : "mt-3.5"}>
            <div className="px-2.5 py-1 text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {section.label}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = currentPath.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href as "/dashboard"}
                  className={cn(
                    "my-px flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-sm transition-colors",
                    active
                      ? "bg-foreground font-medium text-background"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count != null && (
                    <span
                      className={cn(
                        "rounded px-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[11.5px]",
                        active
                          ? "border border-white/15 bg-white/12 text-background"
                          : "border border-border bg-surface-2 text-muted-foreground"
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / user */}
      <div className="border-t border-border p-2.5">
        <Link
          href="/account"
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-surface-2"
        >
          <div className="grid h-6 w-6 place-items-center rounded-full bg-accent/35 text-xs font-semibold">
            {user?.display_name?.[0] ?? "U"}
          </div>
          <div className="flex-1 text-left leading-tight">
            <div className="text-[13.5px] font-medium">{user?.display_name ?? "User"}</div>
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] text-muted-foreground">
              {user?.role ?? "viewer"}
            </div>
          </div>
        </Link>
        <form action={signOutAction} className="mt-1">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <SignOut size={14} />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </div>
  );
}
