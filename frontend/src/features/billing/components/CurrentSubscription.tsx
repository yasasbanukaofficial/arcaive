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
        hidden: { opacity: 0, scale: 0.98 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { type: "tween", duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className="p-6 sm:p-8 bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[32px] shadow-[var(--shadow-premium)] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-brand)]/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-brand)]/10 border border-[var(--accent-brand)]/20 flex items-center justify-center shadow-[var(--shadow-premium)] group-hover:scale-105 transition-transform duration-500">
            <Zap size={28} className="text-[var(--accent-brand)] fill-current" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-1">Active Cluster Tier</p>
            <h2 className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight leading-none capitalize">
              {plan.name} Node
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] rounded-full">
           <div className={`w-2 h-2 rounded-full animate-pulse ${subscription.isActive ? 'bg-[var(--accent-brand)]' : 'bg-red-500'}`} />
           <span className="text-[13px] font-bold tracking-tight text-[var(--text-primary)]">
             Status: {subscription.isActive ? "Operational" : "Offline"}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        <div className="p-6 bg-[var(--bg-color)] rounded-[24px] border border-[var(--glass-border)] hover:border-[var(--text-primary)]/10 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Rate Limit</span>
          </div>
          <p className="text-[28px] font-bold text-[var(--text-primary)] tracking-tighter">
            ${plan.price}
            <span className="text-[14px] font-medium text-[var(--text-tertiary)] tracking-normal ml-1">
              /{subscription.billingPeriod}
            </span>
          </p>
        </div>

        <div className="p-6 bg-[var(--bg-color)] rounded-[24px] border border-[var(--glass-border)] hover:border-[var(--text-primary)]/10 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Next Sync</span>
          </div>
          <p className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
            {new Date(subscription.renewalDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="p-6 bg-[var(--accent-brand)] rounded-[24px] border border-[var(--accent-brand)]/20 shadow-[var(--shadow-premium)] group/cta cursor-pointer overflow-hidden relative">
          <div className="absolute inset-0 bg-white/[0.05] translate-y-full group-hover/cta:translate-y-0 transition-transform duration-500" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Zap className="w-4 h-4 text-[var(--accent-brand-contrast)]/60" />
            <span className="text-[11px] font-bold text-[var(--accent-brand-contrast)]/60 uppercase tracking-widest">Resource Optimizer</span>
          </div>
          <p className="text-[18px] font-bold text-[var(--accent-brand-contrast)] tracking-tight leading-tight relative z-10">
            Upgrade for 2x performance limits
          </p>
        </div>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <div className="mt-8 p-5 rounded-[20px] bg-red-500/5 border border-red-500/10 flex items-center gap-4 relative z-10">
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
             <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-[13px] font-semibold text-red-500/80 tracking-tight">
            Subscription termination scheduled for the end of current cycle.
          </p>
        </div>
      )}
    </motion.div>
  );
}
