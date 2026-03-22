import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

const protectedPrefixes = ["/dashboard", "/contacts"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return updateSession(request);
  }

  const { supabase, response } = await createSupabaseMiddlewareClient(request);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
