"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function QuotaExceededModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleQuotaExceeded = (event: any) => {
      setMessage(event.detail?.message || "You've reached your free quota limit.");
      setIsOpen(true);
    };

    window.addEventListener("arcaive-quota-exceeded", handleQuotaExceeded);
    return () => window.removeEventListener("arcaive-quota-exceeded", handleQuotaExceeded);
  }, []);

  const handleUpgrade = () => {
    setIsOpen(false);
    router.push("/billing");
  };

  const handleViewBilling = () => {
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
                Quota Limit Reached
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="font-mono text-[18px] text-[var(--text-primary)] hover:opacity-60 transition-opacity"
              >
                ×
              </button>
            </div>
            <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />

            <div className="p-[48px] space-y-6">
              <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {message}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
                NEED_MORE_HELP? <span className="text-[var(--text-primary)] underline cursor-pointer">CONTACT_SUPPORT</span>
              </p>
            </div>

            <div className="mt-4">
              <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />
              <div className="px-[48px] py-8 flex justify-end gap-4">
                <button
                  className="btn-ghost"
                  onClick={handleViewBilling}
                >
                  VIEW BILLING
                </button>
                <button
                  className="btn-primary"
                  onClick={handleUpgrade}
                >
                  UPGRADE PLAN
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
