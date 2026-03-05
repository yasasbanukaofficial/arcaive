"use client";
import { useQuery } from "@tanstack/react-query";
import { memberAPI } from "../api/memberAPI";

export function useMemberSettings() {
  return useQuery({
    queryKey: ["member", "settings"],
    queryFn: () => memberAPI.get(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
}
