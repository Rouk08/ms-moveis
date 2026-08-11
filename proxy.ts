import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie:
      req.headers.get("x-forwarded-proto") === "https" ||
      req.nextUrl.protocol === "https:",
  });

  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  try {
    const fs = await import("node:fs");
    fs.appendFileSync(
      "/tmp/proxy-debug.log",
      `${new Date().toISOString()} method=${req.method} path=${pathname} isLoggedIn=${isLoggedIn} cookies=${req.cookies.getAll().map((c) => c.name).join(",")}\n`
    );
  } catch {}

  if (!isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
