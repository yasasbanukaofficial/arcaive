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
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border shadow-xl"
          style={{
            backgroundColor: "var(--d-surface)",
          }}
        >
          <div className="p-6 pt-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "var(--d-text-muted)" }}
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-5">
              <div className="space-y-2">
                <h2
                  className="text-lg sm:text-xl font-medium"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  Quota Limit Reached
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  {message}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full h-11 sm:h-12 text-sm font-medium rounded-xl"
                  onClick={handleUpgrade}
                >
                  Upgrade Plan
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full h-11 sm:h-12 text-sm font-medium rounded-xl border"
                  onClick={handleViewBilling}
                >
                  View Billing
                </Button>
              </div>

              <p className="text-xs" style={{ color: "var(--d-text-muted)" }}>
                Need more help? <span className="underline cursor-pointer">Contact support</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
