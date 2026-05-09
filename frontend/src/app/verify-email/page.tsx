"use client";

import React, { useState } from "react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate verification - in real app, call your API here
    setTimeout(() => {
        setLoading(false);
        addToast({
            type: "success",
            title: "Verified",
            description: "Your email has been verified successfully.",
        });
        router.push("/login");
    }, 1500);
  };

  return (
    <AuthLayout
      title="Verify Email"
      subtitle="Enter the verification code sent to your email to activate your account."
    >
      <form onSubmit={handleVerify} className="space-y-6">
        <TextField
          label="Verification Code"
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <Button 
            variant="primary" 
            className="w-full h-12" 
            type="submit" 
            loading={loading}
        >
            Verify Account
        </Button>
      </form>
    </AuthLayout>
  );
}
