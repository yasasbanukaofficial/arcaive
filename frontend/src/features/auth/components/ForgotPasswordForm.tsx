"use client";

import React, { useEffect, useActionState, startTransition } from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
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
          <label className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
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
                : "border-[var(--glass-border)] bg-[var(--glass-bg)] focus:border-[var(--glass-border)]"
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

        <button
          type="submit"
          className="btn-primary w-full mt-4"
          disabled={isPending}
        >
          {isPending ? "SENDING..." : "SEND RESET LINK"}
        </button>
      </form>
    </>
  );
}
