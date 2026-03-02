"use server";
import { NextRequest, NextResponse } from "next/server";
import { URL } from "node:url";

export default function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/404", req.url));
  }

  if(token && (pathname == "/register"  || pathname == "/login" || pathname == "/onboarding")) {
    return NextResponse.redirect(new URL("/overview", req.url));
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
    "/billing/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/developers/:path*",
    "/onboarding/:path*",
  ],
};
