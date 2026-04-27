"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Loader2, BrainCircuit, Target, Zap } from "lucide-react";

interface Step {
  id: number;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  { 
    id: 1, 
    label: "Analyzing Profile", 
    description: "Extracting key strengths and experiences from your CV...",
    icon: <BrainCircuit className="w-5 h-5" />
  },
  { 
    id: 2, 
    label: "Processing Job Details", 
    description: "Identifying mandatory requirements and ATS keywords...",
    icon: <Target className="w-5 h-5" />
  },
  { 
    id: 3, 
    label: "Primary Tailoring Pass", 
    description: "Aligning your experience with the job role for maximum impact...",
    icon: <Sparkles className="w-5 h-5" />
  },
  { 
    id: 4, 
    label: "Finalizing & Polishing", 
    description: "Ensuring formatting and keyword density is perfect...",
    icon: <Zap className="w-5 h-5" />
  }
];

export default function TailoringProgressModal({ isOpen }: { isOpen: boolean }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setProgress(0);
      return;
    }

    // Simulate progress based on common AI response times (10-20 seconds total)
    const totalDuration = 15000; // 15 seconds
    const intervalTime = 100;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 99; // Hold at 99% until backend finishes
        }
        
        // Update current step based on progress thresholds
        if (next < 25) setCurrentStep(1);
        else if (next < 50) setCurrentStep(2);
        else if (next < 80) setCurrentStep(3);
        else setCurrentStep(4);
        
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70"
        />

        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="relative w-full max-w-[560px] bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-hidden"
          style={{ borderRadius: 0 }}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-[48px] py-6">
              <h2 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase">
                Tailoring CV
              </h2>
            </div>
            <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />

            <div className="p-[48px] space-y-8">
              <div className="space-y-4">
                <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  Our AI agents are optimizing your profile for this specific role.
                </p>
                <div className="h-[2px] w-full bg-[#E8E6DE]">
                  <motion.div 
                    className="h-full bg-black"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {STEPS.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <motion.div
                      key={step.id}
                      initial={false}
                      animate={{ 
                        opacity: isActive || isCompleted ? 1 : 0.4,
                      }}
                      className={`flex items-start gap-4 p-4 border  duration-300 ${
                        isActive ? "bg-[var(--glass-border)] border-[var(--glass-border)]" : "bg-[var(--glass-bg)] border-[var(--glass-border)]"
                      }`}
                    >
                      <span className="font-mono text-[14px] text-[var(--text-primary)] pt-0.5">
                        {isCompleted ? "✓" : "→"}
                      </span>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)]">
                            {step.label}
                          </span>
                        </div>
                        {isActive && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]" 
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                  EST_WAIT_TIME: 10-20_SECONDS
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
