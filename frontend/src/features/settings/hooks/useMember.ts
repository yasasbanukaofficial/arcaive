"use client";
import { useQuery } from "@tanstack/react-query";
import { customerAPI } from "../api/customerAPI";

export function useMemberSettings() {
  return useQuery({
    queryKey: ["member", "settings"],
    queryFn: () => customerAPI.get(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
}
