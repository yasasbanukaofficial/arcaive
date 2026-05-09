"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import { useUsageQuota } from "@/features/billing/hooks/useSubscription";
import { useMemberSettings } from "@/features/settings/hooks/useMember";
import { 
  DUMMY_AGENTS, 
  DUMMY_QUICK_ACTIONS, 
  USAGE_DAYS, 
  USAGE_DATA,
  DUMMY_ACTIVITIES 
} from "@/features/dashboard/constants/mockData";

export default function DashboardPage() {
  const { data: usage } = useUsageQuota();
  const { data: member } = useMemberSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.setItem("access_token", "true");
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  // Fallbacks for data
  const cvUsed = usage?.cvAnalysisUsed || 52;
  const cvLimit = usage?.cvAnalysisLimit || 100;
  
  const jobUsed = usage?.jobSearchUsed || 29;
  const jobLimit = usage?.jobSearchLimit || 100;
  
  const intUsed = usage?.interviewUsed || 49;
  const intLimit = usage?.interviewLimit || 100;

  const mainAgent = DUMMY_AGENTS[0] || { name: "Discovery Agent", status: "active" };

  return (
    <div className="w-full h-full flex flex-col gap-8 pb-12">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h1 className="font-sans text-[32px] font-medium text-white tracking-tight leading-none capitalize">
          Welcome back, {member?.memberFullName?.split(' ')[0] || 'User'}
        </h1>
        <div className="flex flex-wrap items-center gap-6 md:gap-16">
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

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
        {/* ROW 1 */}
        {/* Total Usage (Col Span 5) */}
        <div className="lg:col-span-5 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-6 lg:p-8 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-start mb-8 gap-4">
            <h2 className="font-sans text-[18px] font-medium text-white">Total API consumption</h2>
            <button className="px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-sans text-[12px] tracking-wide shrink-0">
              Upgrade quota
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
            <MiniChart title="CV Analysis" trend="↑" range={`${cvUsed}–${cvLimit}`} />
            <MiniChart title="Job Search" trend="↓" range={`${jobUsed}–${jobLimit}`} />
            <MiniChart title="Interviews" trend="↑" range={`${intUsed}–${intLimit}`} />
          </div>
        </div>

        {/* Active Agents (Col Span 4) */}
        <div className="lg:col-span-4 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-6 lg:p-8 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-start mb-6">
            <h2 className="font-sans text-[18px] font-medium text-white">Active agents</h2>
            <button className="text-white/50 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="font-sans text-[13px] text-white/60">{mainAgent.name} <span className="text-white capitalize">{mainAgent.status}</span></span>
            {/* Toggle */}
            <div className="w-9 h-5 bg-white rounded-full p-[2px] flex justify-end shrink-0 cursor-pointer">
              <div className="w-[16px] h-[16px] bg-[#161616] rounded-full shadow-sm" />
            </div>
          </div>

          <div className="flex-1 relative rounded-[16px] min-h-[160px] overflow-hidden bg-[#0d0d0d] border border-[#2a2a2a] mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#161616] to-[#0d0d0d]" />
            <div className="w-3/4 h-3/4 border border-[#e6efdf]/20 rounded-lg relative flex items-center justify-center">
               <div className="absolute top-1/4 bottom-1/4 left-1/4 right-1/4 border border-[#e6efdf]/30 rounded flex items-center justify-center shadow-[0_0_15px_rgba(230,239,223,0.1)]">
                 <div className="w-8 h-6 bg-[#e6efdf]/20 border border-[#e6efdf]/40 rounded-sm" />
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-sans text-[13px] text-white/70">System capacity</span>
            <div className="flex-1 h-[2px] bg-[#2a2a2a] relative">
              <div className="absolute left-0 top-0 bottom-0 w-[83%] bg-white" />
            </div>
            <span className="font-mono text-[16px] font-medium text-white">83%</span>
          </div>
        </div>

        {/* Quick Actions (Col Span 3) */}
        <div className="lg:col-span-3 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-6 lg:p-8 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-sans text-[18px] font-medium text-white">Quick actions</h2>
            <button className="text-white/50 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <p className="font-sans text-[13px] text-white/50 mb-6">Start from a template to boost productivity</p>

          <div className="space-y-3 flex-1 flex flex-col">
            <div className="bg-[#e6efdf] rounded-[16px] p-5 flex-1 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity">
              <p className="font-sans text-[13px] font-semibold text-[#111] leading-snug">
                {DUMMY_QUICK_ACTIONS[0]?.description || "AI-powered resume optimization"}
              </p>
              <p className="font-sans text-[12px] text-[#111]/50 font-medium">{DUMMY_QUICK_ACTIONS[0]?.title || "Resume Builder"}</p>
            </div>
            
            <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-[16px] p-5 cursor-pointer hover:bg-[#2a2a2a] transition-colors">
              <p className="font-sans text-[13px] font-medium text-white leading-snug mb-4">
                {DUMMY_QUICK_ACTIONS[1]?.description || "Craft compelling cover letters"}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-sans text-[12px] text-white/40">{DUMMY_QUICK_ACTIONS[1]?.title || "Cover Letter"}</span>
                <span className="font-sans text-[12px] text-white/40">5 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        {/* Tracking (Col Span 2) */}
        <div className="lg:col-span-2 bg-[#e6efdf] rounded-[24px] p-6 lg:p-8 flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-sans text-[18px] font-semibold text-[#111]">Tracking</h2>
              <button className="text-[#111]/50 hover:text-[#111] transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            <p className="font-sans text-[12px] font-medium text-[#111]/60">Avg response time</p>
          </div>
          
          <div className="mt-8 lg:mt-0">
            <p className="font-mono text-[48px] font-medium text-[#111] leading-none mb-2">1.2</p>
            <p className="font-sans text-[12px] font-medium text-[#111]/60">seconds</p>
          </div>
        </div>

        {/* Detailed Report (Col Span 3) */}
        <div className="lg:col-span-3 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-6 lg:p-8 flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="flex justify-between items-start mb-3">
              <h2 className="font-sans text-[18px] font-medium text-white">Usage history</h2>
              <button className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-sans text-[11px] tracking-wide flex items-center gap-1">
                Week <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <p className="font-sans text-[12px] font-medium text-white/50">Graphs of API consumption</p>
          </div>

          <div className="flex justify-between items-end gap-2 mt-8 lg:mt-6 overflow-x-auto no-scrollbar">
            {USAGE_DAYS.map((day, i) => {
              const currentVal = USAGE_DATA[i];
              const prevVal = USAGE_DATA[i === 0 ? 0 : i - 1];
              const trend = currentVal > prevVal ? "↑" : currentVal < prevVal ? "↓" : "−";
              // Highlight the highest day
              const highestVal = Math.max(...USAGE_DATA);
              const isActive = currentVal === highestVal;

              return (
                <DayColumn 
                  key={day} 
                  day={day} 
                  trend={trend} 
                  activeNum={currentVal.toString()} 
                  active={isActive} 
                />
              )
            })}
          </div>
        </div>

        {/* Green energy usage (Col Span 7) */}
        <div className="lg:col-span-7 bg-[#e6efdf] rounded-[24px] p-6 lg:p-8 flex flex-col lg:flex-row justify-between min-h-[280px] gap-8">
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="font-sans text-[18px] font-semibold text-[#111] mb-2">Event log timeline</h2>
              <p className="font-sans text-[12px] font-medium text-[#111]/60">Recent automated tasks</p>
            </div>
            <div className="mt-8 lg:mt-0">
              <p className="font-mono text-[48px] font-medium text-[#111] leading-none mb-2">12k+</p>
              <p className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#111]/50 uppercase">Tasks completed</p>
            </div>
          </div>
          
          <div className="flex flex-col items-start lg:items-end w-full lg:w-auto">
            <button className="px-4 py-1.5 rounded-full border border-[#111]/20 hover:bg-[#111]/10 transition-colors text-[#111]/80 font-sans text-[12px] tracking-wide font-medium mb-8 lg:mb-auto">
              View all
            </button>

            {/* Timeline */}
            <div className="flex items-center gap-0 w-full overflow-x-auto no-scrollbar pb-2 lg:pb-4 lg:pr-4">
               {DUMMY_ACTIVITIES.slice(0, 6).map((item, idx, arr) => (
                 <React.Fragment key={idx}>
                   <TimelineDot time={item.time.replace(' ago', '').replace(' ', '')} active={idx < 4} filled={idx < 4} />
                   {idx < arr.length - 1 && <TimelineLine active={idx < 3} />}
                 </React.Fragment>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MiniChart({ title, trend, range }: { title: string, trend: string, range: string }) {
  // Generate random bars to simulate the sparkline
  const leftBars = [30, 40, 35, 50, 45];
  const rightBars = [80, 90, 85, 100];

  return (
    <div className="flex flex-col h-full min-h-[140px]">
      <div className="flex items-center justify-between mb-4">
         <span className="font-sans text-[12px] font-medium text-white/50 truncate pr-2">{title} <span className="text-white/80 ml-1">{trend}</span></span>
         <button className="shrink-0"><MoreHorizontal className="w-4 h-4 text-white/30" /></button>
      </div>

      <div className="flex-1 flex items-end gap-[1px] mb-6 border-b border-[#2a2a2a] pb-2">
        {/* Dark (Left) Bars */}
        {leftBars.map((height, i) => (
          <div key={`l-${i}`} className="w-1 sm:w-[3px] bg-white/20 rounded-t-sm transition-all" style={{ height: `${height}%` }} />
        ))}
        <div className="w-1 sm:w-2 shrink-0" />
        {/* Light (Right) Bars */}
        {rightBars.map((height, i) => (
          <div key={`r-${i}`} className="w-1 sm:w-[3px] bg-white rounded-t-sm transition-all shadow-[0_0_8px_rgba(255,255,255,0.4)]" style={{ height: `${height}%` }} />
        ))}
      </div>

      <div className="mt-auto">
        <p className="font-mono text-[28px] lg:text-[36px] font-medium text-white leading-none tracking-tighter mb-2">{range}</p>
        <p className="font-sans text-[10px] font-medium text-white/40 tracking-wider uppercase">Units used</p>
      </div>
    </div>
  )
}

function DayColumn({ day, trend, activeNum, active }: { day: string, trend: string, activeNum: string, active: boolean }) {
  return (
    <div className="flex flex-col items-center shrink-0 min-w-[36px]">
      <div className="flex items-center gap-1 mb-4">
         <span className="font-sans text-[11px] font-medium text-white/50">{day}</span>
         <span className="text-[10px] text-white/50">{trend}</span>
      </div>
      
      <div className="flex flex-col items-center gap-1 mb-4 opacity-50">
         <span className="font-mono text-[11px] text-white leading-none">{activeNum}</span>
         <span className="font-sans text-[9px] text-white">req</span>
      </div>

      <div className="w-[16px] lg:w-[20px] rounded-sm h-[6px] overflow-hidden bg-[#2a2a2a] flex">
         {active ? (
           <div className="w-full bg-white h-full shrink-0" />
         ) : null}
      </div>
    </div>
  )
}

function TimelineDot({ time, active, filled }: { time: string, active: boolean, filled?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10 w-8 shrink-0">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${active ? 'border-[#111]' : 'border-[#111]/20'} bg-[#e6efdf]`}>
        {filled && <div className="w-3 h-3 bg-[#111] rounded-full shadow-sm" />}
      </div>
      <span className={`font-mono text-[9px] lg:text-[10px] uppercase font-bold transition-colors ${active ? 'text-[#111]' : 'text-[#111]/40'}`}>
        {time}
      </span>
    </div>
  )
}

function TimelineLine({ active }: { active?: boolean }) {
  return (
    <div className={`min-w-[20px] lg:min-w-[40px] flex-1 h-[2px] transition-colors ${active ? 'bg-[#111]' : 'bg-[#111]/20'} rounded-full mx-[-4px] z-0 -translate-y-3 shrink-0`} />
  )
}
