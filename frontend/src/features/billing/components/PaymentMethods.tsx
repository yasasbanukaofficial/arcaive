"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { PaymentMethod } from "@/@types/subscription";
import { useTheme } from "@/features/dashboard/components/ThemeContext";
import Button from "@/components/ui/Button";

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function PaymentMethods({
  methods,
  onAdd,
  onRemove,
  onSetDefault,
}: PaymentMethodsProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6"
      style={{
        backgroundColor: isDark ? "var(--d-surface)" : "#ffffff",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--d-text-primary)" }}
        >
          Payment Methods
        </h2>
        <Button
          variant="secondary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={onAdd}
        >
          Add New
        </Button>
      </div>

      <div className="space-y-3">
        {methods.length === 0 ? (
          <p
            className="text-sm text-center py-8"
            style={{ color: "var(--d-text-tertiary)" }}
          >
            No payment methods available
          </p>
        ) : (
          methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                backgroundColor: isDark
                  ? "var(--d-surface-hover)"
                  : "rgba(0,0,0,0.02)",
                border: method.isDefault
                  ? "2px solid var(--d-accent)"
                  : "1px solid var(--d-border-subtle)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "var(--d-accent)", opacity: 0.1 }}
                >
                  <CreditCard
                    className="w-5 h-5"
                    style={{ color: "var(--d-accent)" }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--d-text-primary)" }}
                    >
                      {method.type === "card"
                        ? `${method.brand} •••• ${method.last4}`
                        : "PayPal"}
                    </p>
                    {method.isDefault && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "var(--d-accent)",
                          color: isDark ? "#000000" : "#ffffff",
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>
                  {method.type === "card" && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--d-text-tertiary)" }}
                    >
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSetDefault(method.id)}
                  >
                    Set Default
                  </Button>
                )}
                <button
                  onClick={() => onRemove(method.id)}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    color: "var(--d-error)",
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
