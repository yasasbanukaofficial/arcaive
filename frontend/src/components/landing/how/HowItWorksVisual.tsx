"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  id: number;
  title: string;
  description: string;
  icon?: any;
  image: string;
};

type Props = {
  steps: Step[];
  activeIndex: number;
};

const HowItWorksVisual = ({ steps, activeIndex }: Props) => {
  const step = steps[activeIndex];

  return (
    <div className="relative aspect-[4/3] rounded-[40px] bg-[#0c0c0c] overflow-hidden border border-white/5 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-full object-cover grayscale brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HowItWorksVisual;
