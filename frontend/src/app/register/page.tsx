import React from "react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Start your free trial and harness invisible power."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
