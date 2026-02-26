"use client";
import { apiInstance } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

const MEMBER_DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/members/${process.env.NEXT_PUBLIC_MEMBER_ID}`!;

const customerAPI = {
  get: async() => (await apiInstance({ baseURL: MEMBER_DATA_URL})).data.data
};

export function useMemberSettings() {
  return useQuery({
    queryKey: ["member", "settings"],
    queryFn: customerAPI.get,
  });
}
