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

  if (memberPassword !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    await authAPI.register({
      memberFullName,
      memberEmail,
      memberUsername: memberEmail.split("@")[0],
      password: memberPassword,
    });
    return { success: true };
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message;
    return { error: msg || "We couldn't create your account right now. Please try again." };
  }
}

export async function loginAction(_prevState : FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await authAPI.login({ email, password });
    
    const token = response.data; 

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'strict',
          path: '/', 
          maxAge: 60 * 60 * 24 * 7
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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      return { success: true };
    }

    const data = await res.json().catch(() => ({}));
    const msg = (data as any)?.message || (data as any)?.error;
    return { error: msg || "We couldn't process that request right now. Please try again." };
  } catch (err: unknown) {
    const msg = (err as any)?.message;
    return { error: msg || "We couldn't process that request right now. Please try again." };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  };

  // Delete JWT cookie set by form login (Next.js server action)
  cookieStore.set("access_token", "", cookieOptions);

  // Delete JWT cookie set by OAuth backend redirect (HttpOnly, Secure, Path=/)
  // We delete with both secure=true and secure=false to cover both environments
  cookieStore.set("access_token", "", {
    ...cookieOptions,
    secure: true,
  });

  // Spring Security session cookies that may be present from OAuth flow
  cookieStore.set("JSESSIONID", "", { ...cookieOptions, httpOnly: true });

  redirect("/login");
}