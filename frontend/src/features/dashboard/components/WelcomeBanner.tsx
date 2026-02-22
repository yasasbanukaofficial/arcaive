"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "./animations";
import Button from "@/components/ui/Button";
import { useTheme } from "./ThemeContext";
import Logo from "@/components/ui/Logo";

export default function WelcomeBanner() {
  const { isDark } = useTheme();
  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-500/8 via-purple-500/5 to-transparent p-8 lg:p-10 transition-colors duration-300"
      style={{ border: "1px solid var(--d-border)" }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-linear-to-t from-purple-500/8 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Logo size={40} showText={false} imageClassName="shrink-0" />
          <div>
            <h2
              className="text-xl sm:text-2xl font-medium tracking-tight mb-1.5"
              style={{ color: "var(--d-text-primary)" }}
            >
              Welcome back
            </h2>
            <p
              className="text-[15px] leading-relaxed max-w-lg"
              style={{ color: "var(--d-text-tertiary)" }}
            >
              Your AI agents have been busy. 3 new applications submitted and 2
              interviews scheduled while you were away.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="lg"
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
          className="whitespace-nowrap"
        >
          View Summary
        </Button>
      </div>
    </motion.div>
  );
}
