"use client";

import type { ComponentProps, ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function SidebarLayout({ sidebar, children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-[232px] shrink-0 border-r border-border bg-background md:flex md:flex-col">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <aside
            className="relative flex h-full w-[232px] flex-col border-r border-border bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        {/* Mobile header bar */}
        <div className="flex h-11 items-center border-b border-border px-3 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            aria-label="メニューを開く"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export function SidebarSection({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-3 py-3", className)} {...props} />;
}

export function SidebarNav({ className, ...props }: ComponentProps<"nav">) {
  return <nav className={cn("flex flex-1 flex-col gap-0.5 overflow-y-auto px-1.5 py-1", className)} {...props} />;
}
