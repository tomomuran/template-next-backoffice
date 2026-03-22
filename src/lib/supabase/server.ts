import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getPublicEnv, getSupabasePublishableKey } from "@/lib/env/schema";

type SupabaseCookieToSet = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getPublicEnv();
  const publishableKey = getSupabasePublishableKey();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: SupabaseCookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }: SupabaseCookieToSet) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components からの setAll は無視し、middleware 側でセッション更新を担保する。
        }
      }
    }
  });
}

export async function createSupabaseServerActionClient() {
  const cookieStore = await cookies();
  const env = getPublicEnv();
  const publishableKey = getSupabasePublishableKey();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: SupabaseCookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }: SupabaseCookieToSet) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}
