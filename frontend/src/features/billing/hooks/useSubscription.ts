"use client";
import { useQuery } from "@tanstack/react-query";
import { subscriptionAPI } from "../api/subscriptionAPI";
import type { MemberSubscription } from "@/@types/subscription";

function mapToMemberSubscription(data: subscriptionAPI.SubscriptionResponse | null): MemberSubscription {
  if (!data) {
    return {
      currentPlan: "explorer",
      billingPeriod: "month",
      renewalDate: new Date().toISOString(),
      isActive: false,
      usage: {
        agentsUsed: 0,
        jobsApplied: 0,
      },
    };
  }

  return {
    currentPlan: data.tier.toLowerCase() as "explorer" | "strategist" | "architect",
    billingPeriod: data.billingCycle.toLowerCase() as "month" | "year",
    renewalDate: data.currentPeriodEnd,
    isActive: data.status === "ACTIVE",
    cancelAtPeriodEnd: data.status === "CANCELLATION_SCHEDULED",
    usage: {
      agentsUsed: 0,
      jobsApplied: 0,
    },
  };
}

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const data = await subscriptionAPI.getMemberSubscription();
      return mapToMemberSubscription(data);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
