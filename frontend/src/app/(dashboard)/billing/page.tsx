"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BillingPage from "@/features/billing/components/BillingPage";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import {
  MOCK_MEMBER_SUBSCRIPTION,
  MOCK_PLANS,
} from "@/features/billing/constants/mockData";

export default function BillingPageWrapper() {
  const router = useRouter();
  const { data: memberSubscription, isLoading, error } = useSubscription();

  const tierOrder = ["explorer", "strategist", "architect"];

  const handleUpgrade = (planId: string) => {
    const currentTierIndex = tierOrder.indexOf(subscription.currentPlan);
    const selectedTierIndex = tierOrder.indexOf(planId);

    if (selectedTierIndex < currentTierIndex) {
      router.push("/subscription?action=cancel");
    } else {
      router.push(`/subscription/checkout?plan=${planId}&billing=month`);
    }
  };

  const handleManageSubscription = () => {
    router.push("/subscription");
  };

  const subscription = isLoading || error ? MOCK_MEMBER_SUBSCRIPTION : (memberSubscription ?? MOCK_MEMBER_SUBSCRIPTION);

  return (
    <BillingPage
      memberSubscription={subscription}
      availablePlans={MOCK_PLANS}
      onUpgrade={handleUpgrade}
      onManageSubscription={handleManageSubscription}
    />
  );
}
