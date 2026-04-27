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
    <div className="flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] py-8 sm:py-10 px-4 sm:px-6 text-center bg-[var(--glass-bg)] border border-[var(--glass-border)]">
      <div className="mb-8">
        <div className="w-16 h-16 border border-[var(--glass-border)] flex items-center justify-center relative">
          <div className="brutalist-spinner" />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="space-y-2">
          <h3 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase tracking-tight">
            Processing
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
            Analyzing your CV against job requirements
          </p>
        </div>
        
        <div className="h-16 border border-[var(--glass-border)] flex items-center justify-center overflow-hidden px-8 bg-[var(--glass-border)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-primary)]">
                {steps[currentStep]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 duration-300 ${i === currentStep ? "w-8 bg-[var(--text-primary)]" : "w-4 bg-[var(--glass-border)]"}`} 
              style={{ borderRadius: "var(--radius)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
