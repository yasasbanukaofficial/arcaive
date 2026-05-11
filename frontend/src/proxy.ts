"use server";
import { NextRequest, NextResponse } from "next/server";
import { URL } from "node:url";

export default function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/verify-email";

  // Prevent logged in users from visiting auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  // Allow guests to access auth pages, but redirect others
  if (!token && !isAuthPage && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/overview/:path*",
    "/chat/:path*",
    "/agents/:path*",
    "/workflow/:path*",
    "/jobs/:path*",
    "/interview/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/developers/:path*",
    "/register",
    "/login",
    "/verify-email"
  ],
};
