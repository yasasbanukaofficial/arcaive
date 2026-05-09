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
      className="p-6 sm:p-8 lg:p-10 bg-[#161616] border border-[#2a2a2a] rounded-[24px]"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e6efdf] flex items-center justify-center">
          <Zap size={24} className="text-[#111]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white/90">
            {plan.name} Plan
          </h2>
          <p className="text-sm text-white/40">
            Your current subscription tier
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        <div className="p-5 bg-[#0e0e0e] rounded-[16px] border border-[#2a2a2a]">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-white/40" />
            <span className="text-[12px] font-medium text-white/40">Price</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            ${plan.price}
            <span className="text-sm font-normal text-white/40">
              /{subscription.billingPeriod}
            </span>
          </p>
        </div>

        <div className="p-5 bg-[#0e0e0e] rounded-[16px] border border-[#2a2a2a]">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-white/40" />
            <span className="text-[12px] font-medium text-white/40">Renewal</span>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-white">
            {new Date(subscription.renewalDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="p-5 bg-[#0e0e0e] rounded-[16px] border border-[#2a2a2a]">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-white/40" />
            <span className="text-[12px] font-medium text-white/40">Status</span>
          </div>
          <p
            className="text-lg sm:text-xl font-semibold"
            style={{
              color: subscription.isActive ? "#4ade80" : "#f87171",
            }}
          >
            {subscription.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <div className="p-4 rounded-[16px] bg-red-500/5 border border-red-500/15 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
          <p className="text-[13px] text-red-400">
            Your subscription will be cancelled at the end of the billing period
          </p>
        </div>
      )}
    </motion.div>
  );
}
