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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="relative mb-12">
        <div className="w-20 h-20 rounded-full border border-[#2a2a2a] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-t-2 border-r-2 border-[#e6efdf] shadow-[0_0_15px_rgba(230,239,223,0.3)]"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] text-[#e6efdf] font-bold">AI</span>
        </div>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="space-y-3">
          <h3 className="font-sans text-[24px] font-medium text-white tracking-tight">
            Neural Alignment
          </h3>
          <p className="font-sans text-[13px] text-white/40 max-w-[280px] mx-auto">
            Our multi-agent system is processing your professional data.
          </p>
        </div>
        
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#e6efdf] font-bold">
                {steps[currentStep]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ 
                scale: i === currentStep ? 1.2 : 1,
                backgroundColor: i === currentStep ? "#e6efdf" : "#2a2a2a",
                opacity: i === currentStep ? 1 : 0.3
              }}
              className="h-1 w-8 rounded-full transition-colors duration-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
