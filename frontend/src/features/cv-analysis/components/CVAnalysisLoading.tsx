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
    <div className="flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] py-8 sm:py-10 px-4 sm:px-6 text-center">
      <div className="mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center relative"
             style={{ backgroundColor: "var(--d-surface-hover)", border: "1px solid var(--d-border)" }}>
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-2xl border-2 border-dashed"
            style={{ borderColor: "var(--d-border-subtle)" }}
          />
          <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl"
               style={{ backgroundColor: "var(--d-surface)", border: "1px solid var(--d-border)" }}>
            <motion.div
              className="w-full h-full rounded-xl border-2 border-t-blue-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-sm w-full space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-medium" style={{ color: "var(--d-text-primary)" }}>
            Processing
          </h3>
          <p className="text-sm" style={{ color: "var(--d-text-muted)" }}>
            Analyzing your CV against job requirements
          </p>
        </div>
        
        <div className="h-10 sm:h-12 rounded-xl border flex items-center justify-center overflow-hidden"
             style={{ backgroundColor: "var(--d-surface-hover)", borderColor: "var(--d-border)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-3 sm:px-4"
            >
              <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--d-text-secondary)" }}>
                {steps[currentStep]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-1.5 sm:gap-2">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? "w-5 sm:w-6 bg-blue-500" : "w-1.5 sm:w-2 bg-white/10"}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
