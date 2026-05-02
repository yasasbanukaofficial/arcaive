"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import Card from "@/components/ui/Card";
import { 
  MOCK_MEMBER_SUBSCRIPTION, 
  MOCK_PLANS 
} from "@/features/billing/constants/mockData";

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div 
      className={`bg-[var(--glass-bg)]/5 ${className}`} 
      style={{ 
        backgroundColor: "var(--bg-color)",
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
      <div className="w-16 h-16 bg-red-500/10 flex items-center justify-center mb-6">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        Failed to load usage data
      </h2>
      <p className="text-sm max-w-md mb-8" style={{ color: "var(--text-secondary)" }}>
        {message}
      </p>
      <button
        onClick={retry}
        className="flex items-center gap-2 px-6 py-3 font-medium transition-all hover:bg-[var(--glass-border)]"
        style={{ 
          backgroundColor: "var(--bg-color)",
          border: "1px solid var(--glass-border)",
          color: "var(--text-primary)"
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
    <div className="space-y-4 py-6 border-b border-[var(--glass-border)]">
      <div className="flex justify-between items-end">
              <span className="font-sans text-[16px] font-bold text-[var(--text-primary)] capitalize">
              {label}
            </span>
            <span className="font-mono text-[12px] tracking-widest text-[var(--text-secondary)]">
              {used} / {isUnlimited ? "∞" : limit} used
            </span>
      </div>
      <div className="h-[6px] w-full border border-[var(--glass-border)] bg-[var(--bg-color)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-[var(--text-primary)]"
        />
      </div>
    </div>
  );
}

export default function UsagePage() {
  const router = useRouter();
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
      className="max-w-7xl mx-auto space-y-8 pb-20 px-4 sm:px-6"
    >
      <motion.div variants={fadeUp} className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-[11px] font-black tracking-[0.3em] text-[var(--text-secondary)]">
                System consumption
              </h1>
            </div>
             <h2 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[0.9] capitalize">
              Network <br /> usage
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-5">
            <div className="flex flex-col items-start md:items-end gap-1.5">
               <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-secondary)]">Subscription tier</span>
              <span className="px-5 py-2.5 text-[11px] font-black tracking-[0.15em] bg-[var(--d-text-primary)] text-[var(--d-bg)]" style={{ borderRadius: "var(--radius)" }}>
                {subscription.currentPlan}
              </span>
            </div>
              <button 
                className="flex items-center gap-2.5 px-6 py-3 text-[11px] font-black uppercase tracking-widest border border-[var(--d-text-primary)] text-[var(--d-text-primary)] transition-all hover:bg-[var(--d-text-primary)] hover:text-[var(--d-bg)]"
                style={{ borderRadius: "var(--radius)" }}
                onClick={() => router.push("/billing")}
              >
               Manage plan
            </button>
          </div>
        </div>
      </motion.div>

      <Card
        title="Resource Boundaries"
        description="Detailed breakdown of your current billing cycle's resource allocation."
        icon={<TrendingUp className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 px-2">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              label={metric.label}
              used={metric.used}
              limit={metric.limit}
              icon={null}
            />
          ))}
        </div>
      </Card>

      <Card
        title="Cycle Synchronization"
        description="System recovery and quota restoration details."
        icon={<Clock className="w-4 h-4" />}
      >
        <div className="flex flex-col sm:flex-row items-center gap-12 py-4">
          <div className="flex-1 space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-tertiary)]">                 Next reset cycle</span>
            <div className="font-display text-4xl sm:text-5xl font-black text-[var(--d-text-primary)]">
               {new Date(usage.periodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
          <div className="flex-1 max-w-sm">
            <p className="font-sans text-[15px] text-[var(--text-secondary)] leading-relaxed">
               All system quotas and resource allowances will be automatically restored to
               their maximum values on the synchronization date.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
