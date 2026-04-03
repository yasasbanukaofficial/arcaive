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
      className={`animate-pulse rounded-lg bg-white/5 ${className}`} 
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
        <Skeleton className="h-20 w-48 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-64 rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>

      <Skeleton className="h-80 rounded-3xl" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-44 rounded-3xl" />)}
      </div>
    </div>
  );
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
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
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
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

function MetricCard({ icon, label, used, limit, sublabel }: MetricCardProps) {
  const { isDark } = useTheme();
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  
  const getStatusColor = () => {
    if (isUnlimited) return "var(--d-accent)";
    if (percentage >= 90) return "var(--d-error)";
    if (percentage >= 75) return "var(--d-warning)";
    return "var(--d-success)";
  };

  const statusColor = getStatusColor();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <motion.div
      variants={fadeUp}
      className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl transition-all duration-200"
      style={{ 
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)"
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--d-surface-hover)" }}
          >
            {React.cloneElement(icon as React.ReactElement, { style: { color: statusColor } })}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--d-text-secondary)" }}>
              {label}
            </p>
            {sublabel && (
              <p className="text-xs mt-0.5" style={{ color: "var(--d-text-muted)" }}>
                {sublabel}
              </p>
            )}
          </div>
        </div>
        
        {isUnlimited ? (
          <div className="flex flex-col items-end">
             <span className="text-xl sm:text-2xl font-bold" style={{ color: "var(--d-text-primary)" }}>
              {formatNumber(used)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
              Unlimited
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <p className="text-xl sm:text-2xl font-bold" style={{ color: "var(--d-text-primary)" }}>
              {formatNumber(used)}
              <span className="text-sm font-normal ml-1" style={{ color: "var(--d-text-muted)" }}>
                / {formatNumber(limit)}
              </span>
            </p>
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded-full mt-1" 
              style={{ 
                backgroundColor: `${statusColor}15`, 
                color: statusColor 
              }}
            >
              {Math.round(percentage)}% used
            </span>
          </div>
        )}
      </div>

      {!isUnlimited && (
        <div className="space-y-3">
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--d-border)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: isDark ? "#ffffff" : "#000000" }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs" style={{ color: "var(--d-text-muted)" }}>
              {formatNumber(Math.max(0, limit - used))} remaining
            </p>
            {percentage >= 90 && (
              <div className="flex items-center gap-1">
                <AlertCircle size={12} style={{ color: "var(--d-error)" }} />
                <p className="text-[10px] font-bold uppercase" style={{ color: "var(--d-error)" }}>
                  Near Limit
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function RadialChart({ value, color }: { value: number; color: string }) {
  const { isDark } = useTheme();
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className={isDark ? "text-white/5" : "text-black/5"}
        />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke={isDark ? "#ffffff" : "#000000"}
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          fill="transparent"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color: "var(--d-text-primary)" }}>{Math.round(value)}%</span>
      </div>
    </div>
  );
}

export default function UsagePage() {
  const { data: subscription, isLoading, error, refetch } = useSubscription();
  const { isDark } = useTheme();

  useEffect(() => {
    if (subscription) {
      console.log("Subscription Data:", subscription);
    }
  }, [subscription]);

  if (isLoading) return <UsageSkeleton />;
  if (error) return <ErrorState message={(error as any).message || "An unexpected error occurred"} retry={refetch} />;
  if (!subscription) return <ErrorState message="No subscription data found" retry={refetch} />;

  const { usage } = subscription;
  
  const currentPlan = MOCK_PLANS.find(
    (plan) => plan.id === subscription.currentPlan && plan.billingPeriod === subscription.billingPeriod
  ) || MOCK_PLANS.find(p => p.id === subscription.currentPlan) || MOCK_PLANS[0];

  const isUnlimited = subscription.currentPlan === "architect";

  const metrics = [
    {
      id: "cv-analysis",
      icon: <BrainCircuit size={18} />,
      label: "CV Analyses",
      used: usage.cvAnalysisUsed,
      limit: usage.cvAnalysisLimit,
    },
    {
      id: "job-search",
      icon: <FileSearch size={18} />,
      label: "Job Searches",
      used: usage.jobSearchUsed,
      limit: usage.jobSearchLimit,
      sublabel: usage.jobResultsPerSearch ? `${usage.jobResultsPerSearch} results each` : undefined,
    },
    {
      id: "interviews",
      icon: <Mic2 size={18} />,
      label: "Interview Sessions",
      used: usage.interviewUsed,
      limit: usage.interviewLimit,
    },
    {
      id: "auto-apply",
      icon: <Rocket size={18} />,
      label: "Auto Applications",
      used: usage.autoApplyUsed,
      limit: usage.autoApplyLimit,
    },
    {
      id: "cv-versions",
      icon: <FileText size={18} />,
      label: "CV Versions",
      used: usage.cvVersionsStored,
      limit: usage.cvVersionsLimit,
    },
  ];

  const activeMetrics = metrics.filter(m => m.limit !== -1 && m.limit > 0);
  const avgUsage = activeMetrics.length > 0 
    ? activeMetrics.reduce((acc, curr) => acc + (curr.used / curr.limit), 0) / activeMetrics.length 
    : 0;
  
  const overallHealth = avgUsage >= 0.9 ? "Critical" : avgUsage >= 0.75 ? "Approaching" : "Healthy";
  const healthColor = overallHealth === "Critical" ? "var(--d-error)" : overallHealth === "Approaching" ? "var(--d-warning)" : "var(--d-success)";

  const now = new Date();
  const endDate = new Date(usage.periodEnd);
  const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.min(30, diffDays));

  const displayEndDate = diffDays > 30 
    ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) 
    : endDate;
  const displayStartDate = new Date(displayEndDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.04, 0.02)}
      className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8 pb-20"
    >
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-semibold" style={{ color: "var(--d-text-primary)" }}>
            Usage Overview
          </h1>
          <p className="text-sm sm:text-base mt-1" style={{ color: "var(--d-text-muted)" }}>
            Monitor your resource consumption and plan limits
          </p>
        </div>

        <div 
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{ 
            backgroundColor: "var(--d-surface)",
            border: "1px solid var(--d-border)"
          }}
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--d-surface-hover)" }}
          >
            <Zap size={20} style={{ color: "var(--d-accent)" }} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--d-text-muted)" }}>
              Current Plan
            </p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold capitalize" style={{ color: "var(--d-text-primary)" }}>
                {subscription.currentPlan}
              </span>
              <span 
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                style={{ 
                  backgroundColor: `${healthColor}15`, 
                  color: healthColor,
                  borderColor: `${healthColor}20`
                }}
              >
                {overallHealth}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div 
          className="lg:col-span-2 p-6 sm:p-8 rounded-3xl overflow-hidden relative"
          style={{ 
            backgroundColor: "var(--d-surface)",
            border: "1px solid var(--d-border)"
          }}
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 -mr-32 -mt-32" 
            style={{ backgroundColor: "var(--d-accent)" }}
          />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: "var(--d-accent)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--d-text-secondary)" }}>
                  Usage Period: {displayStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {displayEndDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: "var(--d-text-primary)" }}>
                You've used {Math.round(avgUsage * 100)}% of your monthly resources
              </h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--d-text-muted)" }}>
                Your usage resets in {daysRemaining} days. 
                Keep track of your limits to ensure uninterrupted service.
              </p>
            </div>
            
            <div className="shrink-0 flex justify-center">
              <RadialChart value={avgUsage * 100} color={healthColor} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div 
            className="p-5 rounded-2xl flex flex-col justify-between"
            style={{ backgroundColor: "var(--d-surface)", border: "1px solid var(--d-border)" }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 mb-3">
              <CheckCircle2 size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--d-text-primary)" }}>
                {metrics.filter(m => m.limit === -1 || (m.limit > 0 && (m.used / m.limit) < 0.75)).length}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--d-text-muted)" }}>
                Healthy Metrics
              </p>
            </div>
          </div>
          <div 
            className="p-5 rounded-2xl flex flex-col justify-between"
            style={{ backgroundColor: "var(--d-surface)", border: "1px solid var(--d-border)" }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10 mb-3">
              <TrendingUp size={16} className="text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--d-text-primary)" }}>
                {metrics.filter(m => m.limit !== -1 && m.limit > 0 && (m.used / m.limit) >= 0.75).length}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--d-text-muted)" }}>
                Nearing Limit
              </p>
            </div>
          </div>
          <div 
            className="p-5 rounded-2xl flex flex-col justify-between"
            style={{ backgroundColor: "var(--d-surface)", border: "1px solid var(--d-border)" }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 mb-3">
              <Clock size={16} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--d-text-primary)" }}>
                {daysRemaining}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--d-text-muted)" }}>
                Days Remaining
              </p>
            </div>
          </div>
          <div 
            className="p-5 rounded-2xl flex flex-col justify-between"
            style={{ backgroundColor: "var(--d-surface)", border: "1px solid var(--d-border)" }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 mb-3">
              <Zap size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold capitalize" style={{ color: "var(--d-text-primary)" }}>
                {subscription.currentPlan}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--d-text-muted)" }}>
                Active Plan
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-3xl p-7 sm:p-8"
        style={{
          backgroundColor: "var(--d-surface)",
          border: "1px solid var(--d-border)",
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-semibold tracking-tight" style={{ color: "var(--d-text-primary)" }}>
              Metrics Overview
            </h3>
            <p className="text-sm mt-0.5" style={{ color: "var(--d-text-muted)" }}>
              Usage percentage across all available resources
            </p>
          </div>
          <BarChart3 size={20} style={{ color: "var(--d-text-muted)" }} />
        </div>

        <div className="flex items-end gap-3 sm:gap-6 h-64 px-2 sm:px-4 relative">
          <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none opacity-20 px-2 sm:px-4">
            {[0, 25, 50, 75, 100].map((tick) => (
              <div key={tick} className="w-full border-t border-dashed border-[var(--d-border)] relative">
                <span className="absolute -left-8 -top-2 text-[10px]" style={{ color: "var(--d-text-ghost)" }}>{tick}%</span>
              </div>
            ))}
          </div>

          {metrics.map((metric) => {
            const isUnlimited = metric.limit === -1;
            const percentage = isUnlimited ? 100 : (metric.limit > 0 ? Math.min((metric.used / metric.limit) * 100, 100) : 0);
            
            return (
              <div key={metric.id} className="flex-1 flex flex-col items-center gap-4 relative z-10 h-full">
                <div className="flex-1 w-full relative flex flex-col justify-end min-h-0">
                  <div 
                    className="absolute inset-x-0 bottom-0 w-full rounded-lg sm:rounded-xl bg-[var(--d-surface-hover)] border border-[var(--d-border-subtle)]"
                    style={{ height: "100%" }}
                  />
                  
                  <motion.div
                    variants={barGrow}
                    className="w-full relative group cursor-pointer flex flex-col justify-end"
                    style={{ height: `${Math.max(2, percentage)}%` }}
                  >
                    <div 
                      className="absolute inset-0 rounded-lg sm:rounded-xl transition-all duration-300" 
                      style={{ 
                        backgroundColor: isDark ? "#ffffff" : "#000000",
                        opacity: percentage > 0 ? 0.9 : 0.2,
                        boxShadow: isDark ? "0 0 15px rgba(255,255,255,0.1)" : "0 0 15px rgba(0,0,0,0.05)"
                      }}
                    />
                    <div className="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
                    
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-95 group-hover:scale-100 z-20">
                      <span
                        className="text-[12px] font-medium backdrop-blur-xl px-3 py-2 rounded-lg whitespace-nowrap shadow-2xl"
                        style={{
                          color: "#ffffff",
                          backgroundColor: "rgba(0,0,0,0.85)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {isUnlimited ? 'Unlimited' : `${Math.round(percentage)}% used`}
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-1 overflow-hidden w-full">
                  <div 
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--d-surface-hover)" }}
                  >
                    {React.cloneElement(metric.icon as React.ReactElement, { size: 14, style: { color: "var(--d-text-secondary)" } })}
                  </div>
                  <span
                    className="text-[10px] sm:text-[11px] font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full text-center"
                    style={{ color: "var(--d-text-muted)" }}
                  >
                    {metric.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div 
        variants={dashboardStagger(0.04, 0)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            icon={metric.icon}
            label={metric.label}
            used={metric.used}
            limit={metric.limit}
            sublabel={metric.sublabel}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
