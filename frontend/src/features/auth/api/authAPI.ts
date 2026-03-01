import { apiInstance } from "@/api/api";
import { Member } from "@/app/data/settings";

const AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`!;

export const authAPI = {
  register: async(payload: Member) => (await apiInstance({method: 'POST', baseURL: `${AUTH_URL}/register`, data: payload})).data.data
};