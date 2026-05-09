"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function QuotaExceededModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleQuotaExceeded = (event: any) => {
      setMessage(event.detail?.message || "You've reached your free quota limit for this billing period.");
      setIsOpen(true);
    };

    window.addEventListener("arcaive-quota-exceeded", handleQuotaExceeded);
    return () => window.removeEventListener("arcaive-quota-exceeded", handleQuotaExceeded);
  }, []);

  const handleUpgrade = () => {
    setIsOpen(false);
    router.push("/billing");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-[480px] bg-[#161616] border border-[#2a2a2a] rounded-[24px] overflow-hidden"
        >
          <div className="p-8 space-y-6">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-[#e6efdf] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#111]" />
            </div>

            {/* Title */}
            <div>
              <h2 className="font-sans text-[20px] font-semibold text-white mb-2">
                Quota limit reached
              </h2>
              <p className="font-sans text-[14px] text-white/50 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Help */}
            <p className="font-sans text-[12px] text-white/30">
              Need more help?{" "}
              <span className="text-white/60 underline cursor-pointer hover:text-white transition-colors">
                Contact Support
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="border-t border-[#2a2a2a] px-8 py-6 flex justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-full border border-[#2a2a2a] text-white/60 hover:text-white hover:bg-[#2a2a2a] transition-colors font-sans text-[13px] font-medium"
            >
              Dismiss
            </button>
            <button
              onClick={handleUpgrade}
              className="px-5 py-2.5 rounded-full bg-[#e6efdf] text-[#111] hover:opacity-90 transition-opacity font-sans text-[13px] font-semibold"
            >
              Upgrade plan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
