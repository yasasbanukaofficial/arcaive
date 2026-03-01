import { authAPI } from "./api/authAPI";

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
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
