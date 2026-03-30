"use client";
import { useQuery } from "@tanstack/react-query";
import { subscriptionAPI } from "../api/subscriptionAPI";
import type { MemberSubscription, UsageQuota } from "@/@types/subscription";

function mapToUsageQuota(data: subscriptionAPI.UsageQuotaResponse | null): UsageQuota {
  if (!data) {
    return {
      periodStart: new Date().toISOString(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cvAnalysisUsed: 0,
      cvAnalysisLimit: 3,
      jobSearchUsed: 0,
      jobSearchLimit: 1,
      jobResultsPerSearch: 5,
      interviewUsed: 0,
      interviewLimit: 1,
      autoApplyUsed: 0,
      autoApplyLimit: 0,
      cvVersionsStored: 0,
      cvVersionsLimit: 1,
    };
  }

  return {
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    cvAnalysisUsed: data.cvAnalysisUsed,
    cvAnalysisLimit: data.cvAnalysisLimit,
    jobSearchUsed: data.jobSearchUsed,
    jobSearchLimit: data.jobSearchLimit,
    jobResultsPerSearch: data.jobResultsPerSearch,
    interviewUsed: data.interviewUsed,
    interviewLimit: data.interviewLimit,
    autoApplyUsed: data.autoApplyUsed,
    autoApplyLimit: data.autoApplyLimit,
    cvVersionsStored: data.cvVersionsStored,
    cvVersionsLimit: data.cvVersionsLimit,
  };
}

function mapToMemberSubscription(
  subscriptionData: subscriptionAPI.SubscriptionResponse | null,
  usageQuota: UsageQuota
): MemberSubscription {
  if (!subscriptionData) {
    return {
      currentPlan: "explorer",
      billingPeriod: "month",
      renewalDate: new Date().toISOString(),
      isActive: false,
      usage: usageQuota,
    };
  }

  return {
    currentPlan: subscriptionData.tier.toLowerCase() as "explorer" | "strategist" | "architect",
    billingPeriod: subscriptionData.billingCycle.toLowerCase() as "month" | "year",
    renewalDate: subscriptionData.currentPeriodEnd,
    isActive: subscriptionData.status === "ACTIVE",
    cancelAtPeriodEnd: subscriptionData.status === "CANCELLATION_SCHEDULED",
    usage: usageQuota,
  };
}

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription", "usage-quota"],
    queryFn: async () => {
      const [subscriptionData, usageQuotaData] = await Promise.all([
        subscriptionAPI.getMemberSubscription(),
        subscriptionAPI.getUsageQuota(),
      ]);
      
      const usageQuota = mapToUsageQuota(usageQuotaData);
      const memberSubscription = mapToMemberSubscription(subscriptionData, usageQuota);
      
      return memberSubscription;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useUsageQuota() {
  return useQuery({
    queryKey: ["usage-quota"],
    queryFn: async () => {
      const data = await subscriptionAPI.getUsageQuota();
      return mapToUsageQuota(data);
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
