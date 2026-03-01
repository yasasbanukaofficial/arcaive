"use client";
import React, { useActionState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SocialButtons from "./SocialButtons";
import PasswordInput from "./PasswordInput";
import { motion } from "framer-motion";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { registerAction } from "../action";
import { useToast } from "@/components/ui/Toast";

export default function RegisterForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [state, formAction, isPending] = useActionState(registerAction, {});

  useEffect(() => {
    if (state.success) {
      addToast({
        type: "success",
        title: "Account created",
        description: "Your account has been created successfully. Redirecting to login...",
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

  return (
    <motion.div variants={staggerContainer(0.12, 0.12)}>
      <motion.div variants={bounceIn}>
        <SocialButtons />
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
        variants={staggerContainer(0.08, 0)}
        className="space-y-4"
        action={formAction}
      >
        <motion.div variants={bounceIn} className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-400 ml-1">
            Full name
          </label>
          <input
            name="memberFullName"
            type="text"
            placeholder="Your name"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
            required
          />
        </motion.div>

        <motion.div variants={bounceIn} className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-400 ml-1">
            Email Address
          </label>
          <input
            name="memberEmail"
            type="email"
            placeholder="name@company.com"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
            required
          />
        </motion.div>

        <motion.div variants={bounceIn} className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-400">
            Password
          </label>
          <PasswordInput name="memberPassword" />
        </motion.div>

        <motion.div variants={bounceIn} className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-400">
            Confirm password
          </label>
          <PasswordInput name="confirmPassword" />
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
    </motion.div>
  );
}
