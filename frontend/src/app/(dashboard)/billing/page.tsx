"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BillingPage from "@/features/billing/components/BillingPage";
import {
  MOCK_MEMBER_SUBSCRIPTION,
  MOCK_PLANS,
  MOCK_BILLING_HISTORY,
  MOCK_PAYMENT_METHODS,
} from "@/features/billing/constants/mockData";

export default function BillingPageWrapper() {
  const router = useRouter();

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

  return (
    <BillingPage
      memberSubscription={MOCK_MEMBER_SUBSCRIPTION}
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
