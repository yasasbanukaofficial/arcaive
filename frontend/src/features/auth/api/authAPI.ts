import { apiInstance } from "@/app/api/axios/api";
import { AuthMember, MemberCreateRequest } from "@/@types/member";

const AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`!;

export const authAPI = {
  register: async (payload: MemberCreateRequest) =>
    (
      await apiInstance({
        method: "POST",
        baseURL: `${AUTH_URL}/register`,
        data: payload,
      })
    ).data.data,
  login: async (payload: AuthMember) =>
    (
      await apiInstance({
        method: "POST",
        baseURL: `${AUTH_URL}/login`,
        data: payload,
      })
    ).data,
  refresh: async () =>
    (
      await apiInstance({
        method: "POST",
        baseURL: `${AUTH_URL}/refresh`,
        withCredentials: true,
      })
    ).data.data,

  logout: async () =>
    (
      await apiInstance({
        method: "POST",
        baseURL: `${AUTH_URL}/logout`,
        withCredentials: true,
      })
    ).data,
  forgotPassword: async (email: string) =>
    (
      await apiInstance({
        method: "POST",
        baseURL: `${AUTH_URL}/forgot-password`,
        headers: { "Content-Type": "application/json" },
        data: { email },
      })
    ).data,
  verifyEmail: async (email: string, code: string) =>
    (
      await apiInstance({
        method: "POST",
        baseURL: `${AUTH_URL}/verify`,
        data: { email, code },
      })
    ).data,
  resendCode: async (email: string) =>
    (
      await apiInstance({
        method: "POST",
        baseURL: `${AUTH_URL}/resend-code`,
        params: { email },
      })
    ).data,
};