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
      <motion.div variants={bounceIn}>
        <SocialButtons googleUrl={`${backendLink}/google`} githubUrl={`${backendLink}/github`} />
      </motion.div>

      <motion.div
        variants={bounceIn}
        className="relative flex items-center gap-4 py-2"
      >
        <div className="h-px flex-1 bg-white/5"></div>
        <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
          Or use email
        </span>
        <div className="h-px flex-1 bg-white/5"></div>
      </motion.div>

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

        <motion.div variants={bounceIn} className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[13px] font-medium text-gray-400">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[12px] text-emerald-500/80 hover:text-emerald-400 transition-colors"
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
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </motion.div>
      </motion.form>

      <motion.div variants={bounceIn} className="text-center">
        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-white hover:underline decoration-white/30 underline-offset-4"
          >
            Create one for free
          </Link>
        </p>
      </motion.div>
    </>
  );
}
