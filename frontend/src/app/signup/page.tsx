import React from "react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import SignupForm from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Start your free trial and harness invisible power."
    >
      <SignupForm />
    </AuthLayout>
  );
}
