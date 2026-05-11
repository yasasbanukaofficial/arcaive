'use server'
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authAPI } from "./api/authAPI";

export type FormState = {
  error?: string;
  success?: boolean;
};

export async function registerAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const memberFullName = formData.get("memberFullName") as string;
  const memberEmail = formData.get("memberEmail") as string;
  const memberPassword = formData.get("memberPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const jobRole = formData.get("jobRole") as string;
  const experience = formData.get("experience") as string;
  const country = formData.get("country") as string;

  if (memberPassword !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    await authAPI.register({
      memberFullName,
      memberEmail,
      memberUsername: memberEmail.split("@")[0],
      password: memberPassword,
      jobRole,
      experience,
      country,
    });
    return { success: true };
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message;
    return { error: msg || "We couldn't create your account right now. Please try again." };
  }
}

export async function verifyEmailAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;

  try {
    await authAPI.verifyEmail(email, code);
    return { success: true };
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message;
    return { error: msg || "Invalid or expired verification code." };
  }
}

export async function resendCodeAction(email: string): Promise<FormState> {
  try {
    await authAPI.resendCode(email);
    return { success: true };
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message;
    return { error: msg || "Failed to resend verification code." };
  }
}

export async function loginAction(_prevState : FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await authAPI.login({ email, password });
    
    const token = response.data; 

    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data;
      const cookieStore = await cookies();

      cookieStore.set("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days (matching Refresh Token)
      });

      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return { success: true };
    }
    return { error: "Login succeeded but no session token was returned. Please try again." };
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message;
    return { error: msg || "Login failed. Please check your credentials." };
  }
}

export async function forgotPasswordAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;

  try {
    await authAPI.forgotPassword(email);
    return { success: true };
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message;
    return { error: msg || "We couldn't process that request right now. Please try again." };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    // Call the logout API using native fetch
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err: unknown) {
    console.error("Logout API call failed:", err);
  }

  const expire = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  };

  cookieStore.set("access_token", "", expire);
  cookieStore.set("refresh_token", "", expire);
  cookieStore.set("JSESSIONID", "", { ...expire, httpOnly: true });

  // Clear any LiveKit session cookies (e.g., sb-hnhs...)
  const allCookies = cookieStore.getAll();
  allCookies.forEach((cookie) => {
    if (cookie.name.startsWith("sb-")) {
      cookieStore.set(cookie.name, "", expire);
    }
  });

  redirect("/login");
}