"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Check,
  X,
  Download,
  ArrowUpRight,
  Receipt,
  Crown,
  Sparkles,
} from "lucide-react";
import Card, { CardRow } from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { BillingData, PlanFeature, Invoice } from "@/app/data/settings";

function FeatureCheckItem({ feature }: { feature: PlanFeature }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
        style={{
          backgroundColor: feature.active
            ? "rgba(34, 197, 94, 0.1)"
            : "var(--d-surface-active)",
          border: `1px solid ${
            feature.active ? "rgba(34, 197, 94, 0.15)" : "var(--d-border)"
          }`,
        }}
      >
        {feature.active ? (
          <Check
            className="w-3 h-3"
            style={{ color: "rgba(34, 197, 94, 0.8)" }}
          />
        ) : (
          <X className="w-3 h-3" style={{ color: "var(--d-text-ghost)" }} />
        )}
      </div>
      <span
        className="text-[13px]"
        style={{
          color: feature.active
            ? "var(--d-text-secondary)"
            : "var(--d-text-muted)",
        }}
      >
        {feature.name}
      </span>
      {feature.strategistOnly && (
        <Badge variant="purple" size="sm">
          Strategist
        </Badge>
      )}
    </div>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid var(--d-border-subtle)" }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--d-surface-active)",
            border: "1px solid var(--d-border)",
          }}
        >
          <Receipt
            className="w-3.5 h-3.5"
            style={{ color: "var(--d-text-muted)" }}
          />
        </div>
        <div className="min-w-0">
          <p
            className="text-[13px] font-medium"
            style={{ color: "var(--d-text-secondary)" }}
          >
            {invoice.date}
          </p>
          <p className="text-[12px]" style={{ color: "var(--d-text-muted)" }}>
            Invoice #{invoice.id}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="text-[13px] font-semibold tabular-nums"
          style={{ color: "var(--d-text-primary)" }}
        >
          {invoice.amount}
        </span>
        <Badge
          variant={invoice.status === "paid" ? "green" : "yellow"}
          size="sm"
        >
          {invoice.status === "paid" ? "Paid" : "Pending"}
        </Badge>
        <button
          type="button"
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
          style={{
            color: "var(--d-text-muted)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--d-surface-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          aria-label="Download invoice"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

type BillingSectionProps = {
  data: BillingData;
};

export default function BillingSection({ data }: BillingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);
  const currentPlan = data.currentPlan;

  const features = data.features;

  const invoices = data.invoices;

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
      }}
    >
      <Card
        title="Current Plan"
        description="Manage your subscription and billing details."
        icon={<Crown className="w-4 h-4" />}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            Upgrade to Strategist
          </Button>
        }
      >
        <div className="space-y-5">
          <CardRow
            label="Active Plan"
            description="Your current subscription tier."
          >
            <div className="flex items-center gap-2">
              <Badge
                variant="blue"
                size="md"
                icon={<Sparkles className="w-3 h-3" />}
              >
                {currentPlan}
              </Badge>
            </div>
          </CardRow>
          <div>
            <p
              className="text-[12px] font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--d-text-muted)" }}
            >
              Plan Features
            </p>
            <div className="space-y-0.5">
              {features.map((feature) => (
                <FeatureCheckItem key={feature.name} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </Card>
      <Card
        title="Payment Method"
        description="Your payment details managed securely through Lemon Squeezy."
        icon={<CreditCard className="w-4 h-4" />}
      >
        <div className="space-y-4">
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              backgroundColor: "var(--d-surface-active)",
              border: "1px solid var(--d-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-7 rounded-md flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
                  border: "1px solid rgba(59, 130, 246, 0.15)",
                }}
              >
                <CreditCard
                  className="w-4 h-4"
                  style={{ color: "rgba(59, 130, 246, 0.7)" }}
                />
              </div>
              <div>
                <p
                  className="text-[13px] font-medium"
                  style={{ color: "var(--d-text-secondary)" }}
                >
                  •••• •••• •••• {data.paymentMethod.last4}
                </p>
                <p
                  className="text-[12px]"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  Expires {data.paymentMethod.expiry}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Update
            </Button>
          </div>

          <CardRow
            label="Billing Cycle"
            description="Switch between monthly and yearly billing. Save 20% with yearly."
          >
            <div className="flex items-center gap-3">
              <span
                className="text-[12px] font-medium"
                style={{
                  color: !isYearly
                    ? "var(--d-text-primary)"
                    : "var(--d-text-muted)",
                }}
              >
                Monthly
              </span>
              <Toggle checked={isYearly} onChange={setIsYearly} size="md" />
              <span
                className="text-[12px] font-medium"
                style={{
                  color: isYearly
                    ? "var(--d-text-primary)"
                    : "var(--d-text-muted)",
                }}
              >
                Yearly
              </span>
              <AnimatePresence>
                {isYearly && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Badge variant="green" size="sm">
                      Save 20%
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardRow>
        </div>
      </Card>
      <Card
        title="Invoice History"
        description="Download past receipts generated by the Merchant of Record (Lemon Squeezy)."
        icon={<Receipt className="w-4 h-4" />}
      >
        <div className="space-y-0">
          {invoices.map((invoice) => (
            <InvoiceRow key={invoice.id} invoice={invoice} />
          ))}
          <div className="pt-3">
            <Button
              variant="ghost"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Download All Invoices
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
