import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!isLoginPage && !isLoggedIn) {
    return Response.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
