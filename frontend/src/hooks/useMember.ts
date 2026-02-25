"use client";
import { useQuery } from "@tanstack/react-query";

const MEMBER_DATA_URL = process.env.NEXT_PUBLIC_MEMBER_DATA_URL!;

const fetchMembers = async () => {
  const response = await fetch(`${MEMBER_DATA_URL}/api/v1/customers/48af44d3-b69d-4ad6-bd56-7aee8846e130`);
  if (!response.ok) {
    throw new Error("Error when fetching member data from API");
  }
  const result = await response.json();
  return result.data;
};

export function useMember() {
  return useQuery({
    queryKey: ["member"],
    queryFn: fetchMembers,
  });
}
