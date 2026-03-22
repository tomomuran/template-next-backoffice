"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {children}
      <AnalyticsProvider />
      <Toaster richColors position="top-right" />
    </>
  );
}
