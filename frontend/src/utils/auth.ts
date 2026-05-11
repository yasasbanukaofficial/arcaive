'use server'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function refreshAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    
    if (!refreshToken) {
        return null;
    }

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
            cookieStore.set("access_token", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
            return newAccessToken;
        }
        return null;
    } catch {
        return null;
    }
}

export async function getToken(): Promise<string> {
    const cookieStore = await cookies();
    let token = cookieStore.get("access_token")?.value;
    
    if (!token) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            return newToken;
        }
        redirect("/login");
    }
    
    return token;
}
