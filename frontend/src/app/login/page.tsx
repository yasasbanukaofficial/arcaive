import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

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
