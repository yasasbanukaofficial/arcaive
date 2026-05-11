"use client";

import React, { useEffect, useActionState, startTransition } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { forgotPasswordAction } from "../action";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "@/utils/validationSchemas";

export default function ForgotPasswordForm() {
  const { addToast } = useToast();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, {});

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => {
      const fd = new FormData();
      fd.append("email", values.email);
      startTransition(() => formAction(fd));
    },
  });

  useEffect(() => {
    if (state.success) {
      addToast({
        type: "success",
        title: "Reset link sent",
        description: `If an account exists for ${formik.values.email}, a reset link has been sent.`,
      });
      setTimeout(() => router.push("/login"), 1500);
    }
    if (state.error) {
      addToast({ type: "error", title: "Request failed", description: state.error });
    }
  }, [state]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="oryzo-label text-[var(--text-secondary)] block">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="name@example.com"
            className={`w-full px-4 py-3 bg-[var(--bg-color)] font-sans text-[15px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] border transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--text-secondary)] ${
              formik.touched.email && formik.errors.email
                ? "border-red-500/50 focus:border-red-500"
                : "border-[var(--glass-border)] focus:border-[var(--text-secondary)]"
            }`}
            style={{ borderRadius: "var(--radius)" }}
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

        <button
          type="submit"
          className="btn-hover w-full group flex items-center justify-center gap-2 border border-[var(--text-primary)] text-[var(--text-primary)] px-6 py-3 hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-text)] transition-all duration-200 font-sans text-[13px] font-bold uppercase tracking-[0.15em]"
          style={{ borderRadius: "var(--radius)" }}
          disabled={isPending}
        >
          <span>{isPending ? "Sending..." : "Send Reset Link"}</span>
          {!isPending && <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>
    </>
  );
}
