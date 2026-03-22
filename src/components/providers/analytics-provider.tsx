"use client";

import { Analytics } from "@vercel/analytics/react";

export function AnalyticsProvider() {
  if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED !== "true") {
    return null;
  }

  return <Analytics />;
}
