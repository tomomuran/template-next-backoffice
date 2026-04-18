"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useCallback } from "react";
import { SidebarLayout } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CommandPalette } from "@/components/ui/command-palette";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [cmdkOpen, setCmdkOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setCmdkOpen((v) => !v);
    }
    if (e.key === "Escape") setCmdkOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <SidebarLayout sidebar={<AppSidebar onOpenCmdk={() => setCmdkOpen(true)} />}>
      {children}
      {cmdkOpen && <CommandPalette onClose={() => setCmdkOpen(false)} />}
    </SidebarLayout>
  );
}
