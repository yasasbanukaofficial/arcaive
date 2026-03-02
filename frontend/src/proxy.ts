'use server'
import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  
  if (!token) {
    return NextResponse.redirect(new URL("/404", req.url));
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
  ],
};
