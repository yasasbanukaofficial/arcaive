'use server'
import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/overview/:path*",
    "/chat/:path*",
    "/agents/:path*",
    "/workflows/:path*",
    "/jobs/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/developers/:path*",
  ],
};
