import React from "react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send instructions to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
