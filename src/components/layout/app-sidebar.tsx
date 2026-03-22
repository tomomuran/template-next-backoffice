"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour, Gear, Users, Kanban, CalendarDots } from "@phosphor-icons/react";
import { SidebarNav, SidebarSection } from "@/components/ui/sidebar";
import { primarySampleFeature } from "@/lib/sample-features";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour },
  { href: primarySampleFeature.href, label: primarySampleFeature.label, icon: Users },
  { href: "/kanban-demo", label: "Kanban", icon: Kanban },
  { href: "/calendar-demo", label: "Calendar", icon: CalendarDots },
  { href: "/account", label: "Account", icon: Gear }
] as const;

export function AppSidebar() {
  const currentPath = usePathname();

  return (
    <div className="sticky top-0 flex h-screen flex-col">
      <SidebarSection>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Template</p>
        <p className="mt-2 text-lg font-semibold">Backoffice</p>
      </SidebarSection>
      <SidebarNav>
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
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
