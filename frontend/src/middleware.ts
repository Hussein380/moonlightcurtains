import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Edge Middleware — runs BEFORE any page renders.
 * Protects all /admin/* routes by checking for the auth cookie server-side.
 * Unauthenticated users are instantly redirected — they never see admin content.
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const { pathname } = req.nextUrl;

  // If trying to access any admin route (except the login page itself)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
