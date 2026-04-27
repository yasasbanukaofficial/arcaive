"use client";

import React, { useActionState, useEffect, startTransition } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import SocialButtons from "./SocialButtons";
import PasswordInput from "./PasswordInput";
import { motion, AnimatePresence } from "framer-motion";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
// Single stagger on form only — no nested stagger wrappers
import { loginAction } from "../action";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { loginSchema } from "@/utils/validationSchemas";

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
      <SocialButtons googleUrl={`${backendLink}/google`} githubUrl={`${backendLink}/github`} />

      <div className="relative flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-[#E8E6DE]"></div>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
          — OR —
        </span>
        <div className="h-px flex-1 bg-[#E8E6DE]"></div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="NAME@COMPANY.COM"
            className={`w-full px-4 py-[14px] font-sans text-[15px] border  focus:outline-none ${
              formik.touched.email && formik.errors.email
                ? "border-[#D83B2A] bg-[#D83B2A]/5 focus:border-[#D83B2A]"
                : "border-[#E8E6DE] bg-white focus:border-black"
            }`}
          />
          <AnimatePresence>
            {formik.touched.email && formik.errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-[11px] mt-2 text-[#D83B2A] uppercase tracking-wider"
              >
                ! {formik.errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="font-sans text-[12px] text-[#888880] hover:text-black transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full mt-4"
          disabled={isPending}
        >
          {isPending ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-center font-sans text-[14px] text-[#888880] mt-8">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-black font-bold hover:underline underline-offset-4"
          >
            Create one for free
          </Link>
        </p>
      </div>
    </>
  );
}
