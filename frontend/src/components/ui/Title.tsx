"use client";

import { motion } from "framer-motion";
import React from "react";

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
};

export default function Title({ title, subtitle, className = "" }: Props) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className={`text-[32px] md:text-[52px] font-light tracking-[-0.03em] leading-[1.1] max-w-4xl text-white host-grotesk ${className}`.trim()}
    >
      {title}
      {subtitle ? <span className="text-white/40">{subtitle}</span> : null}
    </motion.h2>
  );
}
