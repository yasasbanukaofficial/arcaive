import { apiInstance } from "@/api/api";
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

};