"use client";

import React, { useState, useEffect, useActionState } from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { forgotPasswordAction } from "../action";

export default function ForgotPasswordForm() {
  const { addToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, {});

  useEffect(() => {
    if (state.success) {
      addToast({
        type: "success",
        title: "Reset link sent",
        description: `If an account exists for ${email}, a reset link has been sent.`,
      });
      setTimeout(() => router.push("/login"), 1500);
    }
    if (state.error) {
      addToast({ type: "error", title: "Request failed", description: state.error });
    }
  }, [state]);

  return (
    <motion.div variants={staggerContainer(0.12, 0.12)}>
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
    </motion.div>
  );
}
