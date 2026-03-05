import { apiInstance } from "@/api/api";
import { getToken } from "@/utils/auth";

const MEMBER_DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/members`!;

export const memberAPI = {
  get: async () => {
    const token = await getToken();
    return (
      await apiInstance({
        baseURL: `${MEMBER_DATA_URL}/me`,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
    ).data.data;
  },
  extractMember: async (payload: File) => {
    const formData = new FormData();
    formData.append('file', payload)
    return (
      await apiInstance({
        method: "POST",
        baseURL: `${MEMBER_DATA_URL}/upload-cv`,
        withCredentials: true,
        data: formData,
      })
    ).data.data;
  },
  update: async (payload: any) => {
    const token = await getToken();
    if (!token) throw new Error("No authentication token found");
    return (
      await apiInstance({
        method: "PUT",
        baseURL: `${MEMBER_DATA_URL}/me`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: payload,
      })
    ).data.data;
  },
  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const token = await getToken();
    if (!token) throw new Error("No authentication token found");
    return (
      await apiInstance({
        method: "PATCH",
        baseURL: `${MEMBER_DATA_URL}/me/password`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: payload,
      })
    ).data;
  },
  updateMfa: async (payload: { enabled: boolean; method: string }) => {
    const token = await getToken();
    if (!token) throw new Error("No authentication token found");
    return (
      await apiInstance({
        method: "PATCH",
        baseURL: `${MEMBER_DATA_URL}/me/mfa`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: payload,
      })
    ).data.data;
  },
  updateLinkedAccounts: async (payload: any[]) => {
    const token = await getToken();
    if (!token) throw new Error("No authentication token found");
    return (
      await apiInstance({
        method: "PATCH",
        baseURL: `${MEMBER_DATA_URL}/me/linked-accounts`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: payload,
      })
    ).data.data;
  },
};
