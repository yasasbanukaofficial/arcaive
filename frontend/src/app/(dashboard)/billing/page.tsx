"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BillingPage from "@/features/billing/components/BillingPage";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import {
  MOCK_MEMBER_SUBSCRIPTION,
  MOCK_PLANS,
  MOCK_BILLING_HISTORY,
  MOCK_PAYMENT_METHODS,
} from "@/features/billing/constants/mockData";

export default function BillingPageWrapper() {
  const router = useRouter();
  const { data: memberSubscription, isLoading, error } = useSubscription();

  const handleUpgrade = (planId: string) => {
    router.push(`/subscription/checkout?plan=${planId}&billing=month`);
  };

  const handleManageSubscription = () => {
    router.push("/subscription");
  };

  const handleAddPaymentMethod = () => {
    console.log("Adding payment method");
  };

  const handleRemovePaymentMethod = (id: string) => {
    console.log("Removing payment method:", id);
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    console.log("Setting default payment method:", id);
  };

  const subscription = isLoading || error ? MOCK_MEMBER_SUBSCRIPTION : (memberSubscription ?? MOCK_MEMBER_SUBSCRIPTION);

  return (
    <BillingPage
      memberSubscription={subscription}
      availablePlans={MOCK_PLANS}
      billingHistory={MOCK_BILLING_HISTORY}
      paymentMethods={MOCK_PAYMENT_METHODS}
      onUpgrade={handleUpgrade}
      onManageSubscription={handleManageSubscription}
      onAddPaymentMethod={handleAddPaymentMethod}
      onRemovePaymentMethod={handleRemovePaymentMethod}
      onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
    />
  );
}
