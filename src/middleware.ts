import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { applyResponseCookies, createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

const publicPrefixes = ["/login", "/auth", "/error"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPublic = pathname === "/" || publicPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (isPublic) {
    return updateSession(request);
  }

  try {
    const { supabase, response } = await createSupabaseMiddlewareClient(request);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
      return applyResponseCookies(response, redirectResponse);
    }

    return response;
  } catch {
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
