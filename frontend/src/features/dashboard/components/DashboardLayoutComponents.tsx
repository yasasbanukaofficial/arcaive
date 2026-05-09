import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

export function DashboardPageWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="w-full h-full flex flex-col gap-8 pb-12">
      {children}
    </div>
  );
}

export function DashboardHeader({ title, subtitle }: { title: string, subtitle?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div className="space-y-3">
        <h1 className="font-sans text-[32px] font-medium text-white tracking-tight leading-none capitalize">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-[15px] max-w-2xl text-[rgba(255,255,255,0.5)] leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-6 md:gap-16 mt-2 md:mt-0">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[20px] font-medium text-white">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="font-sans text-[12px] font-medium text-white/50 tracking-wide uppercase">Time</span>
        </div>
        <div className="font-sans text-[20px] font-medium text-white">
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
        </div>
      </div>
    </div>
  );
}

export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
      {children}
    </div>
  );
}

export function DashboardCard({ children, className = "", title, action }: { children: React.ReactNode, className?: string, title?: React.ReactNode, action?: React.ReactNode }) {
  return (
    <div className={`bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-6 lg:p-8 flex flex-col min-h-[min-content] ${className}`}>
      {title && (
        <div className="flex justify-between items-start mb-6 gap-4">
          {typeof title === 'string' ? (
            <h2 className="font-sans text-[18px] font-medium text-white">{title}</h2>
          ) : (
            title
          )}
          {action ? action : <button className="text-white/50 hover:text-white transition-colors shrink-0"><MoreHorizontal className="w-5 h-5" /></button>}
        </div>
      )}
      {children}
    </div>
  );
}

export function DashboardLightCard({ children, className = "", title, action }: { children: React.ReactNode, className?: string, title?: React.ReactNode, action?: React.ReactNode }) {
  return (
    <div className={`bg-[#e6efdf] rounded-[24px] p-6 lg:p-8 flex flex-col text-[#111] min-h-[min-content] ${className}`}>
      {title && (
        <div className="flex justify-between items-start mb-6 gap-4">
          {typeof title === 'string' ? (
            <h2 className="font-sans text-[18px] font-semibold text-[#111]">{title}</h2>
          ) : (
            title
          )}
          {action ? action : <button className="text-[#111]/50 hover:text-[#111] transition-colors shrink-0"><MoreHorizontal className="w-5 h-5" /></button>}
        </div>
      )}
      {children}
    </div>
  );
}
