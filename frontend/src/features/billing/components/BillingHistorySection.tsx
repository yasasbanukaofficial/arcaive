"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Clock, CheckCircle, XCircle } from "lucide-react";
import { BillingHistory } from "@/@types/subscription";
import { useTheme } from "@/features/dashboard/components/ThemeContext";
import Button from "@/components/ui/Button";

interface BillingHistoryProps {
  history: BillingHistory[];
}

export default function BillingHistorySection({
  history,
}: BillingHistoryProps) {
  const { isDark } = useTheme();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <CheckCircle
            className="w-4 h-4"
            style={{ color: "var(--d-success)" }}
          />
        );
      case "pending":
        return (
          <Clock className="w-4 h-4" style={{ color: "var(--d-warning)" }} />
        );
      case "failed":
        return (
          <XCircle className="w-4 h-4" style={{ color: "var(--d-error)" }} />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=" p-6"
      style={{
        backgroundColor: isDark ? "var(--glass-bg)" : "#ffffff",
        border: "1px solid var(--glass-border)",
      }}
    >
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Billing History
      </h2>

      <div className="space-y-3">
        {history.length === 0 ? (
          <p
            className="text-sm text-center py-8"
            style={{ color: "var(--d-text-tertiary)" }}
          >
            No billing history available
          </p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4  transition-colors"
              style={{
                backgroundColor: isDark
                  ? "var(--bg-color)"
                  : "rgba(0,0,0,0.02)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--d-text-tertiary)" }}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  ${item.amount.toFixed(2)}
                </span>
                {item.invoice && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                    onClick={() => window.open(item.invoice, "_blank", "noopener,noreferrer")}
                  >
                    Invoice
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
