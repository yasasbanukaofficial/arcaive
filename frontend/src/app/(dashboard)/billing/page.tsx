"use client";

import React from "react";
import BillingPage from "@/features/billing/components/BillingPage";
import {
  MOCK_USER_SUBSCRIPTION,
  MOCK_PLANS,
  MOCK_BILLING_HISTORY,
  MOCK_PAYMENT_METHODS,
} from "@/app/data/billing";

export default function BillingPageWrapper() {
  const handleUpgrade = (planId: string) => {
    console.log("Upgrading to plan:", planId);
  };

  const handleManageSubscription = () => {
    console.log("Managing subscription");
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
      userSubscription={MOCK_USER_SUBSCRIPTION}
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
