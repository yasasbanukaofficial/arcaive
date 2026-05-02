"use client";

import React, { useActionState, useEffect, startTransition } from "react";
import Link from "next/link";
import SocialButtons from "./SocialButtons";
import PasswordInput from "./PasswordInput";
import { motion, AnimatePresence } from "framer-motion";
import { loginAction } from "../action";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { loginSchema } from "@/utils/validationSchemas";
import { ArrowRight } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [state, formAction, isPending] = useActionState(loginAction, {});
  const backendLink = `${process.env.NEXT_PUBLIC_BACKEND_URL!}oauth2/authorization`;

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      const fd = new FormData();
      fd.append("email", values.email);
      fd.append("password", values.password);
      startTransition(() => formAction(fd));
    },
  });

  useEffect(() => {
    if (state.success) {
      localStorage.setItem("access_token", "true");
      addToast({
        type: "success",
        title: "Signed in",
        description: "Welcome! Redirecting you to your dashboard...",
      });
      setTimeout(() => router.push("/overview"), 1500);
    }
    if (state.error) {
      addToast({
        type: "error",
        title: "Sign in failed",
        description: state.error,
      });
    }
  }, [state]);

  return (
    <>
      <div className="w-full">
        <SocialButtons googleUrl={`${backendLink}/google`} githubUrl={`${backendLink}/github`} />
      </div>

      <div className="relative flex items-center gap-4 py-8">
        <div className="h-[1px] flex-1 bg-[var(--glass-border)]"></div>
        <span className="font-sans text-[12px] text-[var(--text-secondary)]">or continue with email</span>
        <div className="h-[1px] flex-1 bg-[var(--glass-border)]"></div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="font-sans text-[13px] font-medium text-[var(--text-secondary)] block">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="name@example.com"
            className={`w-full px-4 py-3 bg-[var(--bg-color)] font-sans text-[15px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] border transition-colors rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--text-secondary)] ${
              formik.touched.email && formik.errors.email
                ? "border-red-500/50 focus:border-red-500"
                : "border-[var(--glass-border)] focus:border-[var(--text-secondary)]"
            }`}
          />
          <AnimatePresence>
            {formik.touched.email && formik.errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="font-sans text-[12px] mt-2 text-red-400"
              >
                {formik.errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2 pb-4">
          <div className="flex justify-between items-center mb-0">
            <label className="font-sans text-[13px] font-medium text-[var(--text-secondary)]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="font-sans text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="••••••••"
            error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
          />
        </div>

        <button
          type="submit"
          className="w-full group flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-color)] px-6 py-3 hover:opacity-90 transition-all duration-200 rounded-lg shadow-lg"
          disabled={isPending}
        >
          <span className="font-sans text-[14px] font-semibold">{isPending ? "Signing in..." : "Sign In"}</span>
          {!isPending && <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="text-center">
        <p className="text-center font-sans text-[14px] text-[var(--text-secondary)] mt-8">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--text-primary)] font-medium hover:underline transition-all"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
