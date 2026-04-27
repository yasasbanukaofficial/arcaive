"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { MemberSubscription, SubscriptionPlan } from "@/@types/subscription";

interface CurrentSubscriptionProps {
  subscription: MemberSubscription;
  plan: SubscriptionPlan;
}

export default function CurrentSubscription({
  subscription,
  plan,
}: CurrentSubscriptionProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className=" sm: p-6 sm:p-8 lg:p-10"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-12 h-12 sm:w-14 sm:h-14  flex items-center justify-center"
          style={{ backgroundColor: "var(--d-surface-hover)" }}
        >
          <Zap
            size={24}
            style={{ color: "var(--d-accent)" }}
          />
        </div>
        <div>
          <h2
            className="text-lg sm:text-xl lg:text-2xl font-semibold"
            style={{ color: "var(--d-text-primary)" }}
          >
            {plan.name} Plan
          </h2>
          <p
            className="text-sm sm:text-base"
            style={{ color: "var(--d-text-muted)" }}
          >
            Your current subscription tier
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div
          className="p-4 sm:p-5  sm:"
          style={{
            backgroundColor: "var(--d-surface-hover)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp
              className="w-4 h-4"
              style={{ color: "var(--d-accent)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--d-text-secondary)" }}
            >
              Price
            </span>
          </div>
          <p
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--d-text-primary)" }}
          >
            ${plan.price}
            <span
              className="text-sm font-normal"
              style={{ color: "var(--d-text-muted)" }}
            >
              /{subscription.billingPeriod}
            </span>
          </p>
        </div>

        <div
          className="p-4 sm:p-5  sm:"
          style={{
            backgroundColor: "var(--d-surface-hover)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar
              className="w-4 h-4"
              style={{ color: "var(--d-accent)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--d-text-secondary)" }}
            >
              Renewal Date
            </span>
          </div>
          <p
            className="text-lg sm:text-xl font-semibold"
            style={{ color: "var(--d-text-primary)" }}
          >
            {new Date(subscription.renewalDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div
          className="p-4 sm:p-5  sm:"
          style={{
            backgroundColor: "var(--d-surface-hover)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle
              className="w-4 h-4"
              style={{ color: "var(--d-accent)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--d-text-secondary)" }}
            >
              Status
            </span>
          </div>
          <p
            className="text-lg sm:text-xl font-semibold"
            style={{
              color: subscription.isActive
                ? "var(--d-success)"
                : "var(--d-error)",
            }}
          >
            {subscription.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <div
          className="mt-6 p-4  sm: flex items-start gap-3"
          style={{
            backgroundColor: "var(--d-error)",
            opacity: 0.1,
          }}
        >
          <AlertCircle
            className="w-5 h-5 shrink-0 mt-0.5"
            style={{ color: "var(--d-error)" }}
          />
          <p
            className="text-sm"
            style={{ color: "var(--d-error)" }}
          >
            Your subscription will be cancelled at the end of the billing period
          </p>
        </div>
      )}
    </motion.div>
  );
}
