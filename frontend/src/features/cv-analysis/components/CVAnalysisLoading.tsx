"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Search, ShieldCheck, Database, Zap } from "lucide-react";

const steps = [
  { icon: Brain, text: "Extracting professional semantic context..." },
  { icon: Search, text: "Cross-referencing skills with job requirements..." },
  { icon: Zap, text: "Calculating technical alignment scores..." },
  { icon: ShieldCheck, text: "Identifying potential career red flags..." },
  { icon: Database, text: "Synthesizing final match verdict..." },
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
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-6 text-center">
      <div className="relative mb-12">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center backdrop-blur-xl"
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-blue-500/10 blur-2xl animate-pulse" />
          <Brain className="w-12 h-12 text-blue-500 relative z-10" />
        </motion.div>
        
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-purple-500/20 blur-xl"
        />
      </div>

      <div className="max-w-xs w-full">
        <h3 className="text-xl font-bold mb-6" style={{ color: "var(--d-text-primary)" }}>
          Intelligence Engine Active
        </h3>
        
        <div className="relative h-12 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center gap-3"
            >
              {React.createElement(steps[currentStep].icon, {
                className: "w-4 h-4 text-blue-400",
              })}
              <p className="text-[14px] font-medium" style={{ color: "var(--d-text-muted)" }}>
                {steps[currentStep].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 w-full h-1.5 rounded-full bg-blue-500/10 overflow-hidden border border-blue-500/5">
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
