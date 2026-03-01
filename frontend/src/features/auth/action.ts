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
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Registration failed";
    return { error: message };
  }
}

export async function loginAction(_prevState : FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await authAPI.login({
      email,
      password,
    });
    localStorage.setItem('token', response.accessToken)
    return { success: true };
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Registration failed";
    return { error: message };
  }
}