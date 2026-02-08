import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout title="Create account" subtitle="Start your free trial and harness invisible power.">
      <SignupForm />
    </AuthLayout>
  );
}
