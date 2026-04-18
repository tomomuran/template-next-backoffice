"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour, Gear, Users, Kanban, CalendarDots, ClockCounterClockwise } from "@phosphor-icons/react";
import { useCurrentUser } from "@/components/providers/auth-provider";
import { SidebarNav, SidebarSection } from "@/components/ui/sidebar";
import { primarySampleFeature } from "@/lib/sample-features";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const items: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour },
  { href: primarySampleFeature.href, label: primarySampleFeature.label, icon: Users },
  { href: "/kanban-demo", label: "Kanban", icon: Kanban },
  { href: "/calendar-demo", label: "Calendar", icon: CalendarDots }
];

const adminItems: NavItem[] = [{ href: "/audit-logs", label: "Audit Logs", icon: ClockCounterClockwise }];

const bottomItems: NavItem[] = [{ href: "/account", label: "Account", icon: Gear }];

export function AppSidebar() {
  const currentPath = usePathname();
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";

  const allItems = [...items, ...(isAdmin ? adminItems : []), ...bottomItems];

  return (
    <div className="sticky top-0 flex h-screen flex-col">
      <SidebarSection>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Template</p>
        <p className="mt-2 text-lg font-semibold">Backoffice</p>
      </SidebarSection>
      <SidebarNav>
        {allItems.map((item) => {
          const Icon = item.icon;
          const active = currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href as "/dashboard"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                active && "bg-foreground text-background hover:bg-foreground hover:text-background"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </SidebarNav>
    </div>
  );
}
