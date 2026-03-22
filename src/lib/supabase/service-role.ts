import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env/schema";

let cachedClient: SupabaseClient | null = null;

export function createServiceRoleClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const env = getServerEnv();

  cachedClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return cachedClient;
}
