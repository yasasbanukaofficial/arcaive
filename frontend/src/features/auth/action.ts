'use server'
import { cookies } from "next/headers";
import { authAPI } from "./api/authAPI";
import { extractErrorMessage } from "@/utils/errors";

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
    return { error: extractErrorMessage(err, "We couldn't create your account right now. Please try again.", "register") };
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
          sameSite: 'lax',
          path: '/', 
          maxAge: 60 * 60 * 24 * 7
      });
      return { success: true };
    }
    return { error: "Login succeeded but no session token was returned. Please try again." };
  } catch (err: unknown) {
    return { error: extractErrorMessage(err, "Login failed. Please check your credentials.", "login") };
  }
}