import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getPublicEnv, getSupabasePublishableKey } from "@/lib/env/schema";

type SupabaseCookieToSet = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

export async function createSupabaseMiddlewareClient(request: NextRequest) {
  const env = getPublicEnv();
  const publishableKey = getSupabasePublishableKey();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: SupabaseCookieToSet[]) {
        cookiesToSet.forEach(({ name, value }: SupabaseCookieToSet) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }: SupabaseCookieToSet) => response.cookies.set(name, value, options));
      }
    }
  });

  return { supabase, response };
}

export function applyResponseCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  return target;
}
