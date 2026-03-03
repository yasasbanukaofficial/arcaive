import { apiInstance } from "@/api/api";
import { AuthMember, Member, SocialLinks } from "@/@types/member";

const AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`!;

export const authAPI = {
  register: async (payload: Member) =>
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
  onboard: async (payload: SocialLinks, token: string) => {
    return (
      await apiInstance({
        method: "PUT",
        baseURL: `${AUTH_URL}/login`,
        headers: { Authorization: `Bearer ${token}` },
        data: payload,
      })
    ).data;
  },
};