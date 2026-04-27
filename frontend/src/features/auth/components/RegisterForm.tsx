"use client";
import React, { useActionState, useEffect, startTransition } from "react";
import Link from "next/link";
import SocialButtons from "./SocialButtons";
import PasswordInput from "./PasswordInput";
import { motion, AnimatePresence } from "framer-motion";
import { registerAction } from "../action";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { registerSchema } from "@/utils/validationSchemas";
import { ArrowRight } from "lucide-react";

const EXPERIENCE_OPTIONS = [
  "Fresh Graduate",
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

export default function RegisterForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [state, formAction, isPending] = useActionState(registerAction, {});
  const backendLink = `${process.env.NEXT_PUBLIC_BACKEND_URL!}oauth2/authorization`;

  const formik = useFormik({
    initialValues: {
      memberFullName: "",
      memberEmail: "",
      memberPassword: "",
      confirmPassword: "",
      jobRole: "",
      experience: "",
      country: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      const fd = new FormData();
      fd.append("memberFullName", values.memberFullName);
      fd.append("memberEmail", values.memberEmail);
      fd.append("memberPassword", values.memberPassword);
      fd.append("confirmPassword", values.confirmPassword);
      fd.append("jobRole", values.jobRole);
      fd.append("experience", values.experience);
      fd.append("country", values.country);
      startTransition(() => formAction(fd));
    },
  });

  useEffect(() => {
    if (state.success) {
      addToast({
        type: "success",
        title: "Account created",
        description: "Redirecting you to login...",
      });
      setTimeout(() => router.push("/login"), 1500);
    }
    if (state.error) {
      addToast({
        type: "error",
        title: "Registration failed",
        description: state.error,
      });
    }
  }, [state]);

  const inputClass = (touched: boolean | undefined, error: string | undefined) =>
    `w-full px-4 py-3 bg-[#0a0a0a] font-sans text-[15px] text-[#ffffff] placeholder-[#444444] border transition-colors rounded-lg focus:outline-none focus:ring-1 focus:ring-[#888888] ${
      touched && error
        ? "border-red-500/50 focus:border-red-500"
        : "border-[#222222] focus:border-[#666666]"
    }`;

  const selectClass = (touched: boolean | undefined, error: string | undefined) =>
    `w-full px-4 py-3 bg-[#0a0a0a] font-sans text-[15px] text-[#ffffff] border transition-colors rounded-lg focus:outline-none focus:ring-1 focus:ring-[#888888] appearance-none cursor-pointer ${
      touched && error
        ? "border-red-500/50 focus:border-red-500"
        : "border-[#222222] focus:border-[#666666]"
    }`;

  return (
    <>
      <div className="w-full">
        <SocialButtons googleUrl={`${backendLink}/google`} githubUrl={`${backendLink}/github`} />
      </div>

      <div className="relative flex items-center gap-4 py-8">
        <div className="h-[1px] flex-1 bg-[#222222]"></div>
        <span className="font-sans text-[12px] text-[#888888]">or continue with email</span>
        <div className="h-[1px] flex-1 bg-[#222222]"></div>
      </div>

      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-sans text-[13px] font-medium text-[#cccccc] block">
              Full Name
            </label>
            <input
              name="memberFullName"
              type="text"
              placeholder="John Doe"
              value={formik.values.memberFullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass(formik.touched.memberFullName, formik.errors.memberFullName)}
            />
            <AnimatePresence>
              {formik.touched.memberFullName && formik.errors.memberFullName && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="font-sans text-[12px] mt-2 text-red-400"
                >
                  {formik.errors.memberFullName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="font-sans text-[13px] font-medium text-[#cccccc] block">
              Email Address
            </label>
            <input
              name="memberEmail"
              type="email"
              placeholder="name@example.com"
              value={formik.values.memberEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass(formik.touched.memberEmail, formik.errors.memberEmail)}
            />
            <AnimatePresence>
              {formik.touched.memberEmail && formik.errors.memberEmail && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="font-sans text-[12px] mt-2 text-red-400"
                >
                  {formik.errors.memberEmail}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-sans text-[13px] font-medium text-[#cccccc] block">
                Password
              </label>
              <PasswordInput
                name="memberPassword"
                placeholder="••••••••"
                value={formik.values.memberPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.memberPassword && formik.errors.memberPassword ? formik.errors.memberPassword : undefined}
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-[13px] font-medium text-[#cccccc] block">
                Confirm Password
              </label>
              <PasswordInput
                name="confirmPassword"
                placeholder="••••••••"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#222222]">
          <div className="space-y-2">
            <label className="font-sans text-[13px] font-medium text-[#cccccc] block">
              Target Role
            </label>
            <input
              name="jobRole"
              type="text"
              placeholder="e.g. Software Engineer"
              value={formik.values.jobRole}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass(formik.touched.jobRole, formik.errors.jobRole)}
            />
            <AnimatePresence>
              {formik.touched.jobRole && formik.errors.jobRole && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="font-sans text-[12px] mt-2 text-red-400"
                >
                  {formik.errors.jobRole}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-sans text-[13px] font-medium text-[#cccccc] block">
                Experience Level
              </label>
              <div className="relative">
                <select
                  name="experience"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={selectClass(formik.touched.experience, formik.errors.experience)}
                >
                  <option value="" disabled>
                    Select experience
                  </option>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <AnimatePresence>
                {formik.touched.experience && formik.errors.experience && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="font-sans text-[12px] mt-2 text-red-400"
                  >
                    {formik.errors.experience}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="font-sans text-[13px] font-medium text-[#cccccc] block">
                Location
              </label>
              <input
                name="country"
                type="text"
                placeholder="e.g. United States"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass(formik.touched.country, formik.errors.country)}
              />
              <AnimatePresence>
                {formik.touched.country && formik.errors.country && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="font-sans text-[12px] mt-2 text-red-400"
                  >
                    {formik.errors.country}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 group flex items-center justify-center gap-2 bg-[#ffffff] text-[#000000] px-6 py-3 hover:bg-[#e0e0e0] transition-colors duration-200 rounded-lg"
          disabled={isPending}
        >
          <span className="font-sans text-[14px] font-semibold">{isPending ? "Creating account..." : "Sign Up"}</span>
          {!isPending && <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="text-center pt-6">
        <p className="text-center font-sans text-[14px] text-[#888888]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#ffffff] font-medium hover:text-[#cccccc] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
