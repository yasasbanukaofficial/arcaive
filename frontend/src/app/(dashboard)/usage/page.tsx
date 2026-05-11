"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCcw,
  ArrowUpRight,
  Zap,
  Activity,
  BarChart3,
  Calendar
} from "lucide-react";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import { useTheme } from "@/features/dashboard/components/ThemeContext";

function MetricCard({ label, used, limit }: { label: string; used: number; limit: number }) {
  const isUnlimited = limit === -1;
  const notApplicable = limit === 0;
  const percentage = isUnlimited ? 100 : notApplicable ? 0 : Math.min((used / limit) * 100, 100);
  const displayEfficiency = notApplicable ? "N/A" : `${Math.round(percentage)}%`;
  
  return (
    <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[24px] p-6 hover:bg-[var(--glass-bg)]/80 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.1em]">{label}</p>
          {isUnlimited ? (
            <p className="text-[22px] font-bold text-[var(--text-primary)] tracking-tighter leading-none">Unlimited</p>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-bold text-[var(--text-primary)] tracking-tighter leading-none">{used}</span>
              <span className="text-[13px] font-medium text-[var(--text-secondary)]">/ {limit}</span>
            </div>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
          <Activity size={14} />
        </div>
      </div>
      
      {!notApplicable && (
        <div className="space-y-3">
          <div className="h-[4px] w-full bg-[var(--text-primary)]/[0.03] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : 'bg-[var(--accent-brand)] shadow-[var(--shadow-premium)]'}`}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Efficiency: {displayEfficiency}</span>
            {percentage > 80 && (
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1">
                <AlertCircle size={10} /> Near Limit
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsagePage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { data: subscription, isLoading, error, refetch } = useSubscription();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  if (isLoading) return (
    <div className="w-full flex flex-col gap-8 pb-20 px-4 md:px-8 animate-pulse">
       <div className="h-20 w-1/3 bg-[var(--text-primary)]/[0.03] rounded-2xl" />
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
         {[1, 2, 3, 4, 5, 6].map(i => (
           <div key={i} className="h-44 bg-[var(--text-primary)]/[0.03] rounded-[24px]" />
         ))}
       </div>
    </div>
  );

  if (error || !subscription) return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-6">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
        <AlertCircle size={32} className="text-red-500/60" />
      </div>
      <h2 className="text-[24px] font-bold text-[var(--text-primary)] mb-3 tracking-tight">Sync Failure</h2>
      <p className="text-[15px] text-[var(--text-secondary)] max-w-md mb-10 leading-relaxed font-medium">
        System was unable to synchronize usage metrics with the cloud. Please verify your connection and try again.
      </p>
      <button
        onClick={() => refetch()}
        className="flex items-center gap-2 px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-full font-bold text-[13px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[var(--shadow-premium)]"
      >
        <RefreshCcw size={16} />
        Initialize Sync
      </button>
    </div>
  );

  const { usage } = subscription;
  
  const metrics = [
    { label: "CV Analyses", used: usage.cvAnalysisUsed, limit: usage.cvAnalysisLimit },
    { label: "Job Searches", used: usage.jobSearchUsed, limit: usage.jobSearchLimit },
    { label: "Interview Sessions", used: usage.interviewUsed, limit: usage.interviewLimit },
    { label: "Auto Applications", used: usage.autoApplyUsed, limit: usage.autoApplyLimit },
    { label: "CV Versions", used: usage.cvVersionsStored, limit: usage.cvVersionsLimit },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full flex flex-col gap-8 pb-20 px-4 md:px-8"
    >
      {/* Header Row */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none">
            Usage
          </h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">System consumption and resource allocation</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end px-6 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[18px]">
             <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest leading-tight">Current Plan</span>
             <span className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight leading-tight capitalize">{subscription.currentPlan}</span>
          </div>
          <button 
            onClick={() => router.push("/billing")}
            className="h-[52px] px-8 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-full font-bold text-[12px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Upgrade Plan <Zap size={14} className="fill-current" />
          </button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* Resource Boundaries Card */}
        <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 ml-1 mb-2">
            <BarChart3 className="w-5 h-5 text-[var(--accent-brand)]" />
            <h2 className="text-[20px] font-semibold text-[var(--text-primary)] tracking-tight">Resource Boundaries</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {metrics.map((metric, idx) => (
              <MetricCard
                key={idx}
                label={metric.label}
                used={metric.used}
                limit={metric.limit}
              />
            ))}
          </div>
        </motion.div>

        {/* Sync Card */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <div className="bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[32px] p-8 h-full flex flex-col relative overflow-hidden shadow-[var(--shadow-premium)] group">
             <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-brand)]/[0.03] to-transparent pointer-events-none" />
             
             <div className="flex items-center gap-3 mb-10 relative z-10">
                <Clock className="w-5 h-5 text-[var(--text-tertiary)]" />
                <h2 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">Synchronization Cycle</h2>
             </div>

             <div className="flex-1 flex flex-col justify-center relative z-10">
                <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-4">Quota Restoration</p>
                <div className="space-y-1">
                  <p className="text-[44px] font-bold text-[var(--text-primary)] tracking-tighter leading-none">
                    {new Date(usage.periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-[16px] font-medium text-[var(--text-secondary)] tracking-tight">Automatic system reset</p>
                </div>
             </div>

             <div className="mt-12 p-6 bg-[var(--text-primary)]/[0.03] rounded-[24px] border border-[var(--glass-border)] relative z-10 group-hover:bg-[var(--text-primary)]/[0.05] transition-colors">
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-medium">
                  All system quotas and resource allowances will be automatically restored to their maximum values on the synchronization date.
                </p>
             </div>
             
             <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 bg-[var(--accent-brand)]/[0.02] rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>

      {/* Activity Log Placeholder */}
      <motion.div variants={itemVariants} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] p-8 mt-8">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <Calendar className="w-5 h-5 text-[var(--text-tertiary)]" />
             <h2 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">System Events</h2>
          </div>
          <button className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors">View full log</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
             <div key={i} className="flex items-center justify-between py-4 border-b border-[var(--glass-border)] last:border-0 opacity-40 hover:opacity-100 transition-opacity group">
                <div className="flex items-center gap-5">
                   <div className="w-2 h-2 rounded-full bg-[var(--accent-brand)]" />
                   <p className="text-[14px] font-medium text-[var(--text-primary)]">System-wide resource synchronization complete</p>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-[12px] font-medium text-[var(--text-tertiary)]">{i} day ago</span>
                   <ArrowUpRight size={14} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
                </div>
             </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

