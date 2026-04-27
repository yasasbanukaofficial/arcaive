"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  FileSearch, 
  Mic2, 
  Rocket, 
  FileText, 
  Zap, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  RefreshCcw
} from "lucide-react";
import { dashboardStagger, fadeUp, barGrow } from "@/features/dashboard/components/animations";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import { useTheme } from "@/features/dashboard/components/ThemeContext";
import { 
  MOCK_MEMBER_SUBSCRIPTION, 
  MOCK_PLANS 
} from "@/features/billing/constants/mockData";

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div 
      className={`bg-[var(--glass-bg)]/5 ${className}`} 
      style={{ 
        backgroundColor: "var(--d-surface-hover)",
        ...style 
      }} 
    />
  );
}

function UsageSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-20 w-48 " />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-64 " />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 " />)}
        </div>
      </div>

      <Skeleton className="h-80 " />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-44 " />)}
      </div>
    </div>
  );
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16  bg-red-500/10 flex items-center justify-center mb-6">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--d-text-primary)" }}>
        Failed to load usage data
      </h2>
      <p className="text-sm max-w-md mb-8" style={{ color: "var(--d-text-muted)" }}>
        {message}
      </p>
      <button
        onClick={retry}
        className="flex items-center gap-2 px-6 py-3  font-medium "
        style={{ 
          backgroundColor: "var(--d-surface-active)",
          border: "1px solid var(--d-border)",
          color: "var(--d-text-primary)"
        }}
      >
        <RefreshCcw size={18} />
        Try Again
      </button>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  used: number;
  limit: number;
  sublabel?: string;
}

function MetricCard({ label, used, limit }: MetricCardProps) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 100 : Math.min((used / limit) * 100, 100);
  
  return (
    <div className="space-y-3 py-6 border-b border-[var(--glass-border)]">
      <div className="flex justify-between items-end">
        <span className="font-sans text-[14px] font-bold uppercase text-[var(--text-primary)]">
          {label}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
          {used} / {isUnlimited ? "∞" : limit} USED
        </span>
      </div>
      <div className="h-[4px] w-full border border-[var(--glass-border)] bg-[var(--glass-bg)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-black"
        />
      </div>
    </div>
  );
}

export default function UsagePage() {
  const { data: subscription, isLoading, error, refetch } = useSubscription();

  if (isLoading) return <UsageSkeleton />;
  if (error) return <ErrorState message={(error as any).message || "An unexpected error occurred"} retry={refetch} />;
  if (!subscription) return <ErrorState message="No subscription data found" retry={refetch} />;

  const { usage } = subscription;
  
  const metrics = [
    {
      id: "cv-analysis",
      label: "CV Analyses",
      used: usage.cvAnalysisUsed,
      limit: usage.cvAnalysisLimit,
    },
    {
      id: "job-search",
      label: "Job Searches",
      used: usage.jobSearchUsed,
      limit: usage.jobSearchLimit,
    },
    {
      id: "interviews",
      label: "Interview Sessions",
      used: usage.interviewUsed,
      limit: usage.interviewLimit,
    },
    {
      id: "auto-apply",
      label: "Auto Applications",
      used: usage.autoApplyUsed,
      limit: usage.autoApplyLimit,
    },
    {
      id: "cv-versions",
      label: "CV Versions",
      used: usage.cvVersionsStored,
      limit: usage.cvVersionsLimit,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.04, 0.02)}
      className="max-w-[800px] mx-auto space-y-16 pb-20 px-6"
    >
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--glass-border)] pb-8">
        <div className="space-y-2">
          <h1 className="font-sans text-[28px] font-bold text-[var(--text-primary)] uppercase tracking-tight">
            Your Usage.
          </h1>
          <p className="font-sans text-[14px] text-[var(--text-secondary)]">
            System resource consumption and plan boundaries.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">CURRENT_SUBSCRIPTION</span>
          <div className="flex items-center gap-4">
            <span className="tag border-[var(--glass-border)] bg-black text-white px-4 py-2 text-[12px]">
              {subscription.currentPlan.toUpperCase()} TIER
            </span>
            <button className="btn-ghost py-2 text-[10px]">
              UPGRADE
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-2">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            used={metric.used}
            limit={metric.limit}
            icon={null}
          />
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="p-8 border border-[var(--glass-border)] bg-[var(--glass-border)] space-y-4">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">NEXT_RESET_CYCLE</span>
        <div className="font-sans text-[24px] font-bold">
          {new Date(usage.periodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase()}
        </div>
        <p className="font-sans text-[14px] text-[var(--text-secondary)]">
          All quotas will be automatically restored to their maximum values on this date.
        </p>
      </motion.div>
    </motion.div>
  );
}
