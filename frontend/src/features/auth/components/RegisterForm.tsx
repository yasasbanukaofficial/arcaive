"use client";
import React, { useActionState, useEffect, startTransition } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Globe, Clock } from "lucide-react";
import SocialButtons from "./SocialButtons";
import PasswordInput from "./PasswordInput";
import CVResumeUpload, { ExtractedMember } from "./CVResumeUpload";
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

  const handleExtracted = (data: ExtractedMember) => {
    if (data.memberFullName) formik.setFieldValue("memberFullName", data.memberFullName);
    if (data.memberEmail) formik.setFieldValue("memberEmail", data.memberEmail);
    if (data.password) {
      formik.setFieldValue("memberPassword", data.password);
      formik.setFieldValue("confirmPassword", data.password);
    }
    if (data.jobRole) formik.setFieldValue("jobRole", data.jobRole);
    if (data.experience) formik.setFieldValue("experience", data.experience);
    if (data.country) formik.setFieldValue("country", data.country);
  };

  useEffect(() => {
    if (state.success) {
      addToast({
        type: "success",
        title: "Account created",
        description: "Your account has been created. Redirecting you to sign in...",
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
    `w-full rounded-xl px-4 py-3 text-white text-[14px] placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${
      touched && error
        ? "bg-red-500/[0.03] border border-red-500/30 focus:ring-red-500/20 focus:border-red-500/40"
        : "bg-white/3 border border-white/10 focus:ring-emerald-500/20 focus:border-emerald-500/40"
    }`;

  const selectClass = (touched: boolean | undefined, error: string | undefined) =>
    `w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
      touched && error
        ? "bg-red-500/[0.03] border border-red-500/30 focus:ring-red-500/20 focus:border-red-500/40 text-white"
        : "bg-white/3 border border-white/10 focus:ring-emerald-500/20 focus:border-emerald-500/40 text-white"
    }`;

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
        variants={staggerContainer(0.025, 0)}
        className="space-y-5"
        onSubmit={formik.handleSubmit}
      >
        {/* ─── Account Details ─── */}
        <motion.div variants={bounceIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-400 ml-1">
              Full name
            </label>
            <input
              name="memberFullName"
              type="text"
              placeholder="Your name"
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
                  className="text-[12px] mt-1 ml-1 text-red-400/90"
                >
                  {formik.errors.memberFullName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-400 ml-1">
              Email Address
            </label>
            <input
              name="memberEmail"
              type="email"
              placeholder="name@company.com"
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
                  className="text-[12px] mt-1 ml-1 text-red-400/90"
                >
                  {formik.errors.memberEmail}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-400">
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

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-400">
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
        </motion.div>

        {/* ─── Job Details Section ─── */}
        <motion.div variants={bounceIn}>
          <div className="relative flex items-center gap-4 pt-1 pb-3">
            <div className="h-px flex-1 bg-white/5"></div>
            <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold whitespace-nowrap">
              Job Details
            </span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-400 ml-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Job Role
              </label>
              <input
                name="jobRole"
                type="text"
                placeholder="Software Engineer"
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
                    className="text-[12px] mt-1 ml-1 text-red-400/90"
                  >
                    {formik.errors.jobRole}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Experience
                </label>
                <select
                  name="experience"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={selectClass(formik.touched.experience, formik.errors.experience)}
                >
                  <option value="" disabled className="bg-[#111] text-gray-500">
                    Select…
                  </option>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#111] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
                <AnimatePresence>
                  {formik.touched.experience && formik.errors.experience && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="text-[12px] mt-1 ml-1 text-red-400/90"
                    >
                      {formik.errors.experience}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
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
                      className="text-[12px] mt-1 ml-1 text-red-400/90"
                    >
                      {formik.errors.country}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={bounceIn}>
          <div className="relative flex items-center gap-4 pt-1 pb-1">
            <div className="h-px flex-1 bg-white/5"></div>
            <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold whitespace-nowrap">
              Or auto-fill with AI
            </span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
        </motion.div>

        <motion.div variants={bounceIn}>
          <CVResumeUpload onExtracted={handleExtracted} />
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
            {isPending ? "Creating..." : "Create account"}
          </Button>
        </motion.div>
      </motion.form>

      <motion.div variants={bounceIn} className="text-center">
        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:underline decoration-white/30 underline-offset-4"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </>
  );
}
