import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function SidebarLayout({ sidebar, header, children }: SidebarLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30 md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-border bg-background md:block">{sidebar}</aside>
      <div className="flex min-h-screen flex-col">
        {header}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function SidebarSection({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("border-b border-border px-4 py-5", className)} {...props} />;
}

export function SidebarNav({ className, ...props }: ComponentProps<"nav">) {
  return <nav className={cn("flex flex-col gap-1 p-3", className)} {...props} />;
}
