"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import SubscriptionChoosingPage from "@/features/subscription/components/SubscriptionChoosingPage";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.05, 0.02)}
      className="max-w-5xl w-full mx-auto space-y-8 px-3 sm:px-6"
    >
      <motion.div variants={fadeUp}>
        <SubscriptionChoosingPage />
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-2xl p-6 text-center max-w-2xl mx-auto"
        style={{
          backgroundColor: "var(--d-surface)",
          border: "1px solid var(--d-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Crown className="w-4 h-4 shrink-0" style={{ color: "var(--d-text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--d-text-muted)" }}>
            Need a custom solution for your team?
            <Link
              href="/subscription/checkout?plan=architect&billing=month"
              className="ml-1 font-medium hover:underline"
              style={{ color: "var(--d-accent)" }}
            >
              Contact us
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
    </div>
  );
}
