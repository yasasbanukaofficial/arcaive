import React from "react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue your journey with your silent AI companion."
    >
      <LoginForm />
    </AuthLayout>
  );
}
