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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl"
          style={{
            backgroundColor: "var(--d-surface)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Progress Bar Background */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--d-text-primary)" }}>
                  Tailoring your CV
                </h2>
                <p className="text-sm" style={{ color: "var(--d-text-muted)" }}>
                  Our AI agents are optimizing your profile for this specific role.
                </p>
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
                      scale: isActive ? 1.02 : 1
                    }}
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      isActive ? "bg-white/5 border border-white/10" : "bg-transparent border border-transparent"
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 ${
                      isCompleted ? "bg-green-500/10 text-green-400" : 
                      isActive ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-white/40"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                    </div>
                    
                    <div className="flex-1 space-y-1 pt-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[15px] font-semibold ${
                          isCompleted ? "text-green-400" : isActive ? "text-blue-400" : "text-white/40"
                        }`}>
                          {step.label}
                        </span>
                        {isActive && (
                          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        )}
                      </div>
                      {isActive && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs leading-relaxed" 
                          style={{ color: "var(--d-text-muted)" }}
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
              <p className="text-[11px] font-medium tracking-wider uppercase opacity-40">
                This usually takes about 10-20 seconds
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
