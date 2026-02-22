"use client";

import React from "react";
import SubscriptionChoosingPage from "@/features/subscription/components/SubscriptionChoosingPage";
import AuthLayout from "@/features/auth/components/AuthLayout";

export default function SubscriptionPage() {
  return (
    <AuthLayout title="Choose a plan" subtitle="Pick a plan to get started">
      <SubscriptionChoosingPage />
    </AuthLayout>
  );
}
