import React, { Suspense } from "react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import VerifyEmailForm from "@/features/auth/components/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the code we sent to your inbox to activate your account."
    >
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  );
}
