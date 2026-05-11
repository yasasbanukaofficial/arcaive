import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

export function DashboardPageWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="w-full flex flex-col gap-10 pb-24 px-4 md:px-8 max-w-[1600px] mx-auto">
      {children}
    </div>
  );
}

export function DashboardHeader({ title, subtitle, action }: { title: string, subtitle?: React.ReactNode, action?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
      <div className="space-y-1">
        <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none capitalize">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {action}
      </div>
    </div>
  );
}

export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 auto-rows-min mt-4">
      {children}
    </div>
  );
}

export function DashboardCard({ children, className = "", title, action }: { children: React.ReactNode, className?: string, title?: React.ReactNode, action?: React.ReactNode }) {
  return (
    <div className={`bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] p-8 md:p-10 flex flex-col shadow-[var(--shadow-premium)] relative overflow-hidden group transition-all duration-300 hover:border-[var(--text-primary)]/10 ${className}`}>
      {title && (
        <div className="flex justify-between items-start mb-8 gap-6 relative z-10">
          {typeof title === 'string' ? (
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">{title}</h2>
          ) : (
            title
          )}
          {action ? action : <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors shrink-0"><MoreHorizontal className="w-5 h-5" /></button>}
        </div>
      )}
      <div className="relative z-10 flex-1">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--text-primary)]/[0.01] to-transparent pointer-events-none" />
    </div>
  );
}

export function DashboardLightCard({ children, className = "", title, action }: { children: React.ReactNode, className?: string, title?: React.ReactNode, action?: React.ReactNode }) {
  return (
    <div className={`bg-[var(--accent-brand)] rounded-[32px] p-8 md:p-10 flex flex-col text-[var(--accent-brand-contrast)] shadow-[var(--shadow-premium)] relative overflow-hidden group transition-all duration-300 hover:scale-[1.01] ${className}`}>
      {title && (
        <div className="flex justify-between items-start mb-8 gap-6 relative z-10">
          {typeof title === 'string' ? (
            <h2 className="text-[20px] font-bold tracking-tight">{title}</h2>
          ) : (
            title
          )}
          {action ? action : <button className="opacity-40 hover:opacity-100 transition-opacity shrink-0"><MoreHorizontal className="w-5 h-5" /></button>}
        </div>
      )}
      <div className="relative z-10 flex-1">
        {children}
      </div>
      <div className="absolute inset-0 bg-white/[0.05] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
    </div>
  );
}
