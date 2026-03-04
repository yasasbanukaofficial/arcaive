"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import SocialButtons from "./SocialButtons";
import PasswordInput from "./PasswordInput";
import { motion } from "framer-motion";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
import { loginAction } from "../action";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const {addToast} = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState(loginAction, {});
  const backendLink = `${process.env.NEXT_PUBLIC_BACKEND_URL!}oauth2/authorization`;

  useEffect(() => {
    if(state.success) {
      addToast({
        type: "success",
        title: "Signed in",
        description: "Welcome back! Redirecting you to your dashboard..."
      })
      setTimeout(() => router.push("/onboarding"), 1500);
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
    <motion.div variants={staggerContainer(0.12, 0.12)}>
      <motion.div variants={bounceIn}>
        <SocialButtons googleUrl={`${backendLink}/google`} githubUrl={`${backendLink}/github`}/>
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
        action={formAction}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
            required
          />
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
    </motion.div>
  );
}
