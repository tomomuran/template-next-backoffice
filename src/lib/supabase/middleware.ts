import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getPublicEnv, getSupabasePublishableKey } from "@/lib/env/schema";

export async function createSupabaseMiddlewareClient(request: NextRequest) {
  const env = getPublicEnv();
  const publishableKey = getSupabasePublishableKey();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, publishableKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        request.cookies.set(name, value);
        response = NextResponse.next({ request });
        response.cookies.set(name, value, options);
      },
      remove(name: string, options: Record<string, unknown>) {
        request.cookies.set(name, "");
        response = NextResponse.next({ request });
        response.cookies.set(name, "", { ...options, maxAge: 0 });
      }
    }
  });

  return { supabase, response };
}
