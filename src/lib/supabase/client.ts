"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv, getSupabasePublishableKey } from "@/lib/env/schema";

export function createSupabaseBrowserClient() {
  const env = getPublicEnv();
  const publishableKey = getSupabasePublishableKey();

  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, publishableKey);
}
