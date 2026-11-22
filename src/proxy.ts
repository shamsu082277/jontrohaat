import { NextRequest, NextResponse } from "next/server";

/**
 * Route guard proxy for JontroHaat.
 *
 * Strategy: Session cookie check only (UX guard).
 * Real authorization is enforced by the Express backend via JWT/JWKS.
 *
 * Better Auth stores the session in a cookie named "better-auth.session_token"
 * (or "__Secure-better-auth.session_token" on HTTPS).
 */

const PROTECTED_PREFIXES = [
  "/dashboard/customer",
  "/dashboard/owner",
  "/dashboard/admin",
  "/payment",
];

function hasSessionCookie(req: NextRequest): boolean {
  // Better Auth session cookies
  const sessionToken =
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("__Secure-better-auth.session_token")?.value;
  return Boolean(sessionToken);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthenticated = hasSessionCookie(req);

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !isAuthenticated) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payment/:path*",
  ],
};
