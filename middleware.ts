import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight guard — real session check happens client-side via Better Auth.
// This just redirects /admin/* to /admin/login if no session cookie.
// Better Auth sets `better-auth.session_token`
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) return NextResponse.next();

  const hasSession = req.cookies.has("better-auth.session_token") || req.cookies.has("__Secure-better-auth.session_token");
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
