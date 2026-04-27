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
      className="relative overflow-hidden bg-white p-8 lg:p-12 transition-[border-color] duration-300 border border-[#E8E6DE]"
      style={{ borderRadius: 0 }}
    >
      <div className="absolute top-0 right-0 w-32 h-full bg-[#F5F4EF] opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 border border-black flex items-center justify-center bg-white shrink-0">
            <Logo size={32} showText={false} />
          </div>
          <div className="space-y-2">
            <h2 className="font-sans text-[24px] font-bold text-black uppercase tracking-tight">
              Welcome back
            </h2>
            <p className="font-sans text-[15px] leading-relaxed max-w-xl text-[#888880]">
              Your AI agents have been busy. <span className="text-black font-bold">3 NEW APPLICATIONS</span> submitted and <span className="text-black font-bold">2 INTERVIEWS</span> scheduled while you were away.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          className="whitespace-nowrap"
        >
          VIEW_SUMMARY →
        </Button>
      </div>
    </motion.div>
  );
}
