"use client";
import { useQuery } from "@tanstack/react-query";

const fetchUsers = async () => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Error when fetching user data from API");
  }
  const result = await response.json();
  return result.data;
};

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUsers,
  });
}
