"use server";
import { NextRequest, NextResponse } from "next/server";
import { URL } from "node:url";

async function refreshAccessToken(request: NextRequest): Promise<NextResponse | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.data?.accessToken;

    if (newAccessToken) {
      const newResponse = NextResponse.next();
      newResponse.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return newResponse;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/verify-email";

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  if (!token && !isAuthPage && !pathname.startsWith("/api")) {
    const refreshResponse = await refreshAccessToken(req);
    if (refreshResponse) {
      return refreshResponse;
    }
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
