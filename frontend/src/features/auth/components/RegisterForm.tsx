"use client";
import React, { useActionState, useEffect, startTransition } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Globe, Clock } from "lucide-react";
import SocialButtons from "./SocialButtons";
import PasswordInput from "./PasswordInput";
import { motion, AnimatePresence } from "framer-motion";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { registerAction } from "../action";
import { useToast } from "@/components/ui/Toast";
import { useFormik } from "formik";
import { registerSchema } from "@/utils/validationSchemas";

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
    `w-full px-4 py-[14px] font-sans text-[15px] border  focus:outline-none ${
      touched && error
        ? "border-[#D83B2A] bg-[#D83B2A]/5 focus:border-[#D83B2A]"
        : "border-[#E8E6DE] bg-white focus:border-black"
    }`;

  const selectClass = (touched: boolean | undefined, error: string | undefined) =>
    `w-full px-4 py-[14px] font-sans text-[15px] border  focus:outline-none appearance-none cursor-pointer ${
      touched && error
        ? "border-[#D83B2A] bg-[#D83B2A]/5 focus:border-[#D83B2A]"
        : "border-[#E8E6DE] bg-white focus:border-black"
    }`;

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

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* ─── Account Details ─── */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
              Full name
            </label>
            <input
              name="memberFullName"
              type="text"
              placeholder="YOUR NAME"
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
                  className="font-mono text-[11px] mt-2 text-[#D83B2A] uppercase tracking-wider"
                >
                  ! {formik.errors.memberFullName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
              Email Address
            </label>
            <input
              name="memberEmail"
              type="email"
              placeholder="NAME@COMPANY.COM"
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
                  className="font-mono text-[11px] mt-2 text-[#D83B2A] uppercase tracking-wider"
                >
                  ! {formik.errors.memberEmail}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
              Password
            </label>
            <PasswordInput
              name="memberPassword"
              value={formik.values.memberPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.memberPassword && formik.errors.memberPassword ? formik.errors.memberPassword : undefined}
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
              Confirm password
            </label>
            <PasswordInput
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
            />
          </div>
        </div>

        {/* ─── Job Details Section ─── */}
        <div className="space-y-6">
          <div className="relative flex items-center gap-4 pt-4">
            <div className="h-px flex-1 bg-[#E8E6DE]"></div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
              JOB DETAILS
            </span>
            <div className="h-px flex-1 bg-[#E8E6DE]"></div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
              Job Role
            </label>
            <input
              name="jobRole"
              type="text"
              placeholder="SOFTWARE ENGINEER"
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
                  className="font-mono text-[11px] mt-2 text-[#D83B2A] uppercase tracking-wider"
                >
                  ! {formik.errors.jobRole}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
                Experience
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
                    SELECT…
                  </option>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.toUpperCase()}
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
                    className="font-mono text-[11px] mt-2 text-[#D83B2A] uppercase tracking-wider"
                  >
                    ! {formik.errors.experience}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
                Country
              </label>
              <input
                name="country"
                type="text"
                placeholder="USA"
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
                    className="font-mono text-[11px] mt-2 text-[#D83B2A] uppercase tracking-wider"
                  >
                    ! {formik.errors.country}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full mt-4"
          disabled={isPending}
        >
          {isPending ? "CREATING..." : "CREATE ACCOUNT"}
        </button>
      </form>

      <div className="text-center pb-8">
        <p className="text-center font-sans text-[14px] text-[#888880] mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black font-bold hover:underline underline-offset-4"
          >
            SIGN IN
          </Link>
        </p>
      </div>
    </>
  );
}
