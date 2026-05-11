"use client";

import React, { useActionState, useEffect, startTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { verifyEmailAction, resendCodeAction } from "../action";
import { useToast } from "@/components/ui/Toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { verifyEmailSchema } from "@/utils/validationSchemas";
import { ArrowRight, Mail } from "lucide-react";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { addToast } = useToast();
  const [state, formAction, isPending] = useActionState(verifyEmailAction, {});

  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema: verifyEmailSchema,
    onSubmit: (values) => {
      const fd = new FormData();
      fd.append("email", email);
      fd.append("code", values.code);
      startTransition(() => formAction(fd));
    },
  });

  useEffect(() => {
    if (state.success) {
      addToast({
        type: "success",
        title: "Account verified",
        description: "Your email has been verified successfully. You can now sign in.",
      });
      setTimeout(() => router.push("/login"), 1500);
    }
    if (state.error) {
      addToast({
        type: "error",
        title: "Verification failed",
        description: state.error,
      });
    }
  }, [state]);

  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--text-primary)]/5 mb-4">
          <Mail className="w-8 h-8 text-[var(--text-primary)]" />
        </div>
        <p className="text-[var(--text-secondary)] font-sans text-[15px]">
          We've sent a 6-digit verification code to
          <br />
          <span className="text-[var(--text-primary)] font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="oryzo-label text-[var(--text-secondary)] block">
            Verification Code
          </label>
          <input
            name="code"
            type="text"
            maxLength={6}
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="000000"
            className={`w-full px-4 py-3 bg-[var(--bg-color)] font-sans text-center text-[24px] tracking-[0.5em] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] border transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--text-secondary)] ${
              formik.touched.code && formik.errors.code
                ? "border-red-500/50 focus:border-red-500"
                : "border-[var(--glass-border)] focus:border-[var(--text-secondary)]"
            }`}
            style={{ borderRadius: "var(--radius)" }}
          />
          <AnimatePresence>
            {formik.touched.code && formik.errors.code && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="font-sans text-[12px] mt-2 text-center text-red-400"
              >
                {formik.errors.code}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          className="w-full group flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-color)] px-6 py-3 hover:bg-[var(--text-secondary)] transition-colors duration-200 font-sans text-[13px] font-bold uppercase tracking-[0.15em]"
          style={{ borderRadius: "var(--radius)" }}
          disabled={isPending}
        >
          <span>{isPending ? "Verifying..." : "Verify Email"}</span>
          {!isPending && <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="text-center pt-8 space-y-4">
        <p className="font-sans text-[14px] text-[var(--text-secondary)]">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={async () => {
              const res = await resendCodeAction(email);
              if (res.success) {
                addToast({
                  type: "success",
                  title: "Code resent",
                  description: "A new verification code has been sent to your email.",
                });
              } else {
                addToast({
                  type: "error",
                  title: "Resend failed",
                  description: res.error || "Please try again later.",
                });
              }
            }}
            className="text-[var(--text-primary)] font-medium hover:underline transition-all"
          >
            Resend Code
          </button>
        </p>
        <p className="font-sans text-[14px] text-[var(--text-secondary)]">
          Need to change email?{" "}
          <Link
            href="/register"
            className="text-[var(--text-primary)] font-medium hover:underline transition-all"
          >
            Go back
          </Link>
        </p>
      </div>
    </>
  );
}
