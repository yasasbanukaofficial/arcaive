"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  "Extracting professional semantic context...",
  "Cross-referencing skills with job requirements...",
  "Calculating technical alignment scores...",
  "Identifying potential career red flags...",
  "Synthesizing final match verdict...",
];

export default function CVAnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative mb-16">
        <div className="w-24 h-24 rounded-full border border-[var(--glass-border)] flex items-center justify-center relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-t-2 border-r-2 border-[var(--accent-brand)] shadow-[0_0_20px_rgba(223,231,216,0.2)]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-brand)] animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-md w-full space-y-10">
        <div className="space-y-3">
          <h3 className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight">
            Neural Processing
          </h3>
          <p className="text-[14px] font-medium text-[var(--text-secondary)] max-w-[320px] mx-auto leading-relaxed">
            Initializing high-precision semantic alignment between entities.
          </p>
        </div>
        
        <div className="h-14 flex items-center justify-center bg-[var(--text-primary)]/[0.02] border border-[var(--glass-border)] rounded-[20px] px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-brand)]">
                {steps[currentStep]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3">
          {steps.map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ 
                scaleY: i === currentStep ? 1.5 : 1,
                backgroundColor: i === currentStep ? "var(--accent-brand)" : "var(--glass-border)",
                opacity: i === currentStep ? 1 : 0.4
              }}
              className="h-1 w-10 rounded-full transition-all duration-700"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
