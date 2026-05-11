"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface SessionUnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionUnavailableModal({ isOpen, onClose }: SessionUnavailableModalProps) {
  const router = useRouter();

  const handleGoBack = () => {
    onClose();
    router.push("/jobs");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-[480px] bg-[#161616] border border-[#2a2a2a] rounded-[32px] overflow-hidden shadow-2xl"
        >
          <div className="p-10 space-y-8 text-center flex flex-col items-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h2 className="text-[24px] font-bold text-white tracking-tight leading-none">
                Session Unavailable
              </h2>
              <p className="text-[15px] text-white/50 leading-relaxed font-medium">
                The interview session could not be established. This might be due to a technical error or an expired session.
              </p>
            </div>

            {/* Actions */}
            <div className="w-full pt-4">
                <button
                onClick={handleGoBack}
                className="w-full h-16 bg-[#e6efdf] text-[#111] rounded-full font-bold text-[14px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                Return to Jobs
                </button>
                <button
                onClick={() => window.location.reload()}
                className="w-full mt-4 h-14 bg-transparent text-white/40 hover:text-white transition-all font-sans text-[13px] font-bold uppercase tracking-widest"
                >
                Try Again
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
