import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const debugHeaders = {
    "x-debug-method": req.method,
    "x-debug-pathname": pathname,
    "x-debug-logged-in": String(isLoggedIn),
    "x-debug-cookie-names": req.cookies
      .getAll()
      .map((c) => c.name)
      .join(","),
  };

  if (!isLoginPage && !isLoggedIn) {
    const res = NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    Object.entries(debugHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  if (isLoginPage && isLoggedIn) {
    const res = NextResponse.redirect(new URL("/admin", req.nextUrl));
    Object.entries(debugHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  const res = NextResponse.next();
  Object.entries(debugHeaders).forEach(([k, v]) => res.headers.set(k, v));
  return res;
});

export const config = {
  matcher: ["/admin/:path*"],
};
