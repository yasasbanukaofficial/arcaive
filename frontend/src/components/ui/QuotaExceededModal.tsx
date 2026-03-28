"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CreditCard, AlertCircle } from "lucide-react";
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
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl"
          style={{
            backgroundColor: "var(--d-surface)",
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full" />

          <div className="relative z-10 p-8 pt-10">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all duration-200"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-6">
              {/* Icon */}
              <div
                className="w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-12"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                }}
              >
                <AlertCircle size={40} className="text-white -rotate-12" />
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <h2
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  Quota Limit Reached
                </h2>
                <p
                  className="text-[15px] leading-relaxed px-4"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  {message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full h-14 text-[16px] font-bold rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300"
                  onClick={handleUpgrade}
                  icon={<Sparkles size={18} />}
                >
                  Upgrade Plan
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full h-14 text-[15px] font-semibold rounded-2xl bg-white/5 border-white/5 hover:bg-white/10"
                  onClick={handleViewBilling}
                  icon={<CreditCard size={18} />}
                >
                  View Billing
                </Button>
              </div>

              <p className="text-[12px]" style={{ color: "var(--d-text-tertiary)" }}>
                Need more help? <span className="underline cursor-pointer">Contact support</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
