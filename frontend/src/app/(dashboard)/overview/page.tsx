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

  if (!mounted) return null;

  // Fallbacks for data
  const cvUsed = usage?.cvAnalysisUsed || 52;
  const cvLimit = usage?.cvAnalysisLimit || 71;
  
  const jobUsed = usage?.jobSearchUsed || 29;
  const jobLimit = usage?.jobSearchLimit || 37;
  
  const intUsed = usage?.interviewUsed || 49;
  const intLimit = usage?.interviewLimit || 85;

  const mainAgent = DUMMY_AGENTS[0] || { name: "Office", status: "Connected" };

  return (
    <div className="w-full flex flex-col gap-6 mx-auto px-2 pb-12">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <h1 className="font-sans text-[36px] font-medium text-white tracking-tight leading-none">
          Overview
        </h1>
        <div className="flex gap-16 items-baseline">
           <div className="flex items-baseline gap-2">
             <span className="font-sans text-[32px] text-white font-medium">11:37 AM</span>
             <span className="font-sans text-[14px] text-white/40">Time</span>
           </div>
           <span className="font-sans text-[32px] text-white/90 font-medium tracking-tight">9 September</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 content-start">
        {/* ROW 1 */}
        {/* Total API consumption (Col Span 6) */}
        <div className="lg:col-span-6 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 flex flex-col min-h-[460px]">
          <div className="flex justify-between items-start mb-12 gap-4">
            <h2 className="font-sans text-[22px] font-medium text-white">Total energy consumption</h2>
            <button className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-sans text-[13px] tracking-wide shrink-0">
              Change module
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 flex-1">
            <MiniChart title="Lighting" trend="↑" range={`${cvUsed}–${cvLimit}`} />
            <MiniChart title="Refrigerator" trend="↓" range={`${jobUsed}–${jobLimit}`} />
            <MiniChart title="Air Conditioner" trend="↑" range={`${intUsed}–${intLimit}`} />
          </div>
        </div>

        {/* Active agents / Connections (Col Span 3) */}
        <div className="lg:col-span-3 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 flex flex-col min-h-[460px]">
          <div className="flex justify-between items-start mb-8">
            <h2 className="font-sans text-[22px] font-medium text-white">Green connections</h2>
            <button className="text-white/50 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <span className="font-sans text-[14px] text-white/60">{mainAgent.name} <span className="text-white capitalize ml-1">{mainAgent.status}</span></span>
            {/* Toggle */}
            <div className="w-11 h-6 bg-white rounded-full p-[2px] flex justify-end shrink-0 cursor-pointer">
              <div className="w-[20px] h-[20px] bg-[#161616] rounded-full shadow-sm" />
            </div>
          </div>

          <div className="flex-1 relative rounded-[16px] min-h-[200px] overflow-hidden bg-transparent mb-8 flex items-center justify-center">
             {/* Replace with 3D Graphic Placeholder matching the room visualizer */}
             <div className="w-full h-full border border-[#e6efdf]/10 rounded-lg relative flex items-center justify-center p-4">
                <div className="w-full h-full relative border border-dashed border-[#e6efdf]/20" style={{ transform: 'perspective(500px) rotateX(10deg) rotateY(-10deg)' }}>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 border-t border-dashed border-[#e6efdf]/20" />
                  <div className="absolute inset-y-0 right-1/4 w-[1px] border-l border-dashed border-[#e6efdf]/20" />
                  <div className="absolute top-1/2 left-1/4 w-12 h-8 border border-[#e6efdf]/30 bg-[#e6efdf]/5 flex items-center justify-center shadow-[0_0_15px_rgba(230,239,223,0.1)]" />
                </div>
             </div>
          </div>

          <div className="flex items-center gap-5 mt-auto">
            <span className="font-sans text-[14px] text-white/70">Available energy</span>
            <div className="flex-1 h-[3px] bg-[#2a2a2a] relative">
              <div className="absolute left-0 top-0 bottom-0 w-[83%] bg-white rounded-full" />
            </div>
            <span className="font-mono text-[20px] font-medium text-white">83%</span>
          </div>
        </div>

        {/* Quick Actions / Recommendations (Col Span 3) */}
        <div className="lg:col-span-3 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 flex flex-col min-h-[460px]">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-sans text-[22px] font-medium text-white">Recommendations</h2>
            <button className="text-white/50 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <p className="font-sans text-[14px] text-white/50 mb-8">Personalized tips for optimizing energy</p>

          <div className="space-y-4 flex-1 flex flex-col">
            <div className="bg-[#e6efdf] rounded-[16px] p-6 flex-[1.2] flex flex-col justify-between cursor-pointer hover:opacity-95 transition-opacity">
              <p className="font-sans text-[14.5px] font-medium text-[#111] leading-relaxed">
                {DUMMY_QUICK_ACTIONS[0]?.description || "Sunny day ahead! We recommend maximizing solar energy usage based..."}
              </p>
              <p className="font-sans text-[13px] text-[#111]/60 font-medium">Today recommendation</p>
            </div>
            
            <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-[16px] p-6 flex-1 flex flex-col justify-between cursor-pointer hover:bg-[#2a2a2a] transition-colors">
              <p className="font-sans text-[14.5px] font-medium text-white leading-relaxed">
                {DUMMY_QUICK_ACTIONS[1]?.description || "Run appliances after 8 PM to reduce grid load."}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-sans text-[13px] text-white/40">Analysis</span>
                <span className="font-sans text-[13px] text-white/40">5 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        {/* Tracking (Col Span 2) */}
        <div className="lg:col-span-2 bg-[#e6efdf] rounded-[24px] p-8 flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-sans text-[22px] font-medium text-[#111]">Tracking</h2>
              <button className="text-[#111]/50 hover:text-[#111] transition-colors"><MoreHorizontal className="w-6 h-6" /></button>
            </div>
            <p className="font-sans text-[14px] font-medium text-[#111]/60">Solar energy tomorrow</p>
          </div>
          
          <div className="mt-auto">
            <p className="font-sans text-[56px] font-medium text-[#111] leading-none mb-3">5.7</p>
            <p className="font-sans text-[14px] font-medium text-[#111]/60">kWh</p>
          </div>
        </div>

        {/* Detailed Report (Col Span 4) */}
        <div className="lg:col-span-4 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-sans text-[22px] font-medium text-white">Detailed report</h2>
              <button className="px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-sans text-[13px] tracking-wide flex items-center gap-1.5">
                Week <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <p className="font-sans text-[14px] font-medium text-white/50">Graphs of energy consumption</p>
          </div>

          <div className="flex justify-between items-end gap-3 mt-12 overflow-x-auto no-scrollbar">
            {USAGE_DAYS.map((day, i) => {
              const currentVal = USAGE_DATA[i];
              const prevVal = USAGE_DATA[i === 0 ? 0 : i - 1];
              const trend = currentVal > prevVal ? "↑" : currentVal < prevVal ? "↓" : "−";
              // Using index 2 (Wed) to mirror the reference image explicitly
              const isActive = i === 2;

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

        {/* Green energy usage / Event log (Col Span 6) */}
        <div className="lg:col-span-6 bg-[#e6efdf] rounded-[24px] p-8 flex flex-col justify-between min-h-[320px] relative">
          <div className="flex justify-between items-start w-full">
            <div>
              <h2 className="font-sans text-[22px] font-medium text-[#111] mb-3">Green energy usage</h2>
              <p className="font-sans text-[14px] font-medium text-[#111]/60">Green energy usage</p>
            </div>
            <button className="px-5 py-2 rounded-full border border-[#111]/30 hover:bg-[#111]/10 transition-colors text-[#111] font-sans text-[14px] tracking-wide font-medium">
              Change
            </button>
          </div>
          
          <div className="flex items-end justify-between mt-auto">
             <div>
                <p className="font-sans text-[56px] font-medium text-[#111] leading-none mb-4">47%</p>
                <p className="font-sans text-[14px] font-medium text-[#111]/50 uppercase tracking-widest">11AM — 3PM</p>
             </div>
             
             {/* Timeline Graphic */}
             <div className="flex items-center gap-0 w-max overflow-x-auto no-scrollbar pb-2 pt-6 shrink-0">
                {DUMMY_ACTIVITIES.slice(0, 6).map((item, idx, arr) => (
                  <React.Fragment key={idx}>
                    <TimelineDot time={item.time.replace(' ago', '').replace(' ', '')} active={idx > 0 && idx < 5} filled={idx > 0 && idx < 5} />
                    {idx < arr.length - 1 && <TimelineLine active={idx > 0 && idx < 4} />}
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
  // We expand the array a bit to give more density like the reference image
  const leftBars = [
    30, 45, 35, 50, 45, 30, 40, 55, 60, 45, 35, 75, 80, 65, 50
  ];
  const rightBars = [
    20, 25, 30, 50, 100, 95, 80, 85, 90, 85, 80, 90, 85, 80, 75
  ];

  return (
    <div className="flex flex-col h-full min-h-[160px]">
      <div className="flex items-center justify-between mb-8">
         <span className="font-sans text-[14px] font-medium text-white/50 truncate pr-2">{title} <span className="text-white ml-2">{trend}</span></span>
         <button className="shrink-0"><MoreHorizontal className="w-4 h-4 text-white/50" /></button>
      </div>

      <div className="flex-1 flex items-end justify-between gap-[2px] mb-8 pb-3 min-h-[140px]">
        {/* Dark (Left) Bars */}
        <div className="flex items-end gap-[1.5px] h-full flex-1 opacity-20">
          {leftBars.map((height, i) => (
            <div key={`l-${i}`} className="flex-1 bg-white rounded-t-sm" style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="w-3 shrink-0" />
        {/* Light (Right) Bars */}
        <div className="flex items-end gap-[1.5px] h-full flex-1">
          {rightBars.map((height, i) => (
            <div key={`r-${i}`} className="flex-1 bg-white rounded-t-sm shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <p className="font-sans text-[44px] font-normal text-white leading-none tracking-tight mb-3">{range}</p>
        <p className="font-sans text-[12px] font-medium text-white/40 tracking-wide">kWh per month</p>
      </div>
    </div>
  )
}

function DayColumn({ day, trend, activeNum, active }: { day: string, trend: string, activeNum: string, active: boolean }) {
  return (
    <div className="flex flex-col flex-1 items-center shrink-0 min-w-[36px]">
      <div className="flex items-center gap-1 mb-6">
         <span className="font-sans text-[13px] font-medium text-white/50">{day}</span>
         <span className="text-[12px] text-white/50">{trend}</span>
      </div>
      
      <div className="flex flex-col items-center gap-1 mb-5 opacity-50 text-left w-full pl-2">
         <span className="font-sans text-[13px] text-white leading-none font-medium">{activeNum}</span>
         <span className="font-sans text-[11px] text-white">kWh</span>
      </div>

      <div className={`w-full rounded-sm h-[8px] overflow-hidden flex ${active ? 'bg-white' : 'bg-[#1f1f1f]'}`}>
      </div>
    </div>
  )
}

function TimelineDot({ time, active, filled }: { time: string, active: boolean, filled?: boolean }) {
  // Convert labels to look like the image (11AM, 11AM, 12PM, 1PM, 2PM, 3PM)
  const isOuter = !active;
  return (
    <div className="flex flex-col items-center gap-4 relative z-10 w-9 shrink-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${active ? 'border-[#111] bg-[#111]' : 'border-[#111]/30 bg-transparent'}`}>
        {!filled && <div className="w-full h-full bg-transparent rounded-full shadow-sm" />}
      </div>
      <span className={`font-sans text-[11px] font-medium uppercase transition-colors ${active ? 'text-[#111]' : 'text-[#111]/50'}`}>
        {time}
      </span>
    </div>
  )
}

function TimelineLine({ active }: { active?: boolean }) {
  return (
    <div className={`min-w-[40px] flex-1 h-[1px] transition-colors ${active ? 'bg-[#111]' : 'bg-[#111]/30 border-b border-dashed border-[#111]/30'} mx-[-6px] z-0 -translate-y-5 shrink-0`} style={!active ? { backgroundImage: 'linear-gradient(to right, #111 50%, transparent 50%)', backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x', backgroundColor: 'transparent', height: '1px' } : {}} />
  )
}

