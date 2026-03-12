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
      <motion.form
        onSubmit={formik.handleSubmit}
        variants={staggerContainer(0.08, 0)}
        className="space-y-4"
      >
        <motion.div variants={bounceIn} className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-400 ml-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="name@company.com"
            className={`w-full rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${
              formik.touched.email && formik.errors.email
                ? "bg-red-500/[0.03] border border-red-500/30 focus:ring-red-500/20 focus:border-red-500/40"
                : "bg-white/[0.03] border border-white/10 focus:ring-emerald-500/20 focus:border-emerald-500/40"
            }`}
          />
          <AnimatePresence>
            {formik.touched.email && formik.errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-[12px] mt-1 ml-1 text-red-400/90"
              >
                {formik.errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={bounceIn}>
          <Button
            type="submit"
            variant="white"
            size="lg"
            fullWidth
            icon={<ArrowRight size={18} />}
            iconPosition="right"
            className="mt-4 font-semibold py-3.5 rounded-full"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send reset link"}
          </Button>
        </motion.div>
      </motion.form>
    </>
  );
}
