import React from "react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import OnboardingForm from "@/features/auth/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="Tell us about yourself to personalize your experience."
    >
      <OnboardingForm />
    </AuthLayout>
  );
}
