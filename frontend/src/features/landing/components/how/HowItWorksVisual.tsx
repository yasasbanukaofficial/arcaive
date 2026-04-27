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
    <div className="relative aspect-[4/3] bg-black overflow-hidden border border-white/10 flex items-center justify-center" style={{ borderRadius: "var(--radius)" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-full object-cover grayscale opacity-50"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HowItWorksVisual;
