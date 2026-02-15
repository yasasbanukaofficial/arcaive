import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: [
    "/chat/:path*",
    "/agents/:path*",
    "/workflows/:path*",
    "/jobs/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/developers/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|images|public|$).*)",
  ],
};
