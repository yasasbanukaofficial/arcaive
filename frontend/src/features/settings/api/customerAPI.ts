'use server'
import { apiInstance } from "@/api/api";
import { getToken } from "@/utils/auth";

const MEMBER_DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/members`!;

export const customerAPI = {
  get: async () => {
    const token = await getToken();
    return (
      await apiInstance({
        baseURL: MEMBER_DATA_URL,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
    ).data.data;
  },
};
