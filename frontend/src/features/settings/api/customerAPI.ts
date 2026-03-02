import { apiInstance } from "@/api/api";

const MEMBER_DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/members/${process.env.NEXT_PUBLIC_MEMBER_ID}`!;

export const customerAPI = {
  get: async() => (await apiInstance({ baseURL: MEMBER_DATA_URL })).data.data
};
