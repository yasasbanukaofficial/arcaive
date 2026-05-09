"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { MoreHorizontal, ChevronDown, Activity, Globe, Zap, ShieldCheck } from "lucide-react";
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
  const router = useRouter();
  const { data: usage } = useUsageQuota();
  const { data: member } = useMemberSettings();
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.setItem("access_token", "true");
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const timeString = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateString = time.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

  // Fallbacks for data
  const cvUsed = usage?.cvAnalysisUsed || 0;
  const cvLimit = usage?.cvAnalysisLimit || 1;
  const jobUsed = usage?.jobSearchUsed || 0;
  const jobLimit = usage?.jobSearchLimit || 1;
  const intUsed = usage?.interviewUsed || 0;
  const intLimit = usage?.interviewLimit || 1;

  // Calculate system capacity based on real usage
  const totalLimit = cvLimit + jobLimit + intLimit;
  const totalUsed = cvUsed + jobUsed + intUsed;
  const capacityPercentage = Math.max(0, Math.round((1 - (totalUsed / totalLimit)) * 100));

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
             <span className="font-sans text-[32px] text-white font-medium">{timeString}</span>
             <span className="font-sans text-[14px] text-white/40">Time</span>
           </div>
           <span className="font-sans text-[32px] text-white/90 font-medium tracking-tight">{dateString}</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 content-start">
        {/* ROW 1 */}
        {/* Total API consumption (Col Span 6) */}
        <div className="lg:col-span-6 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 flex flex-col min-h-[460px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <div className="flex justify-between items-start mb-12 gap-4">
            <h2 className="font-sans text-[22px] font-medium text-white">API consumption</h2>
            <button 
              onClick={() => router.push("/billing")}
              className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-sans text-[13px] tracking-wide shrink-0"
            >
              Upgrade quota
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-16 relative z-10">
            <MiniChart title="Neural Latency" trend="↓" range="142ms" subLabel="ms delay" icon={Activity} />
            <MiniChart title="System Throughput" trend="↑" range="8.4" subLabel="gb/s flux" icon={Globe} />
            <MiniChart title="Token Inference" trend="↑" range="24.5" subLabel="ops/sec" icon={Zap} />
            <MiniChart title="Buffer Integrity" trend="−" range="98%" subLabel="health" icon={ShieldCheck} />
          </div>
        </div>

        {/* Active agents / Connections (Col Span 3) */}
        <div className="lg:col-span-3 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 flex flex-col min-h-[460px]">
          <div className="flex justify-between items-start mb-8">
            <h2 className="font-sans text-[22px] font-medium text-white">Active agents</h2>
            <button className="text-white/50 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <span className="font-sans text-[14px] text-white/60">Voice Interface <span className="text-white capitalize ml-1">Active</span></span>
          </div>

          <div className="flex-1 relative rounded-[16px] min-h-[200px] overflow-hidden bg-transparent mb-8 flex items-center justify-center">
             <VoiceAgentVisualizer />
          </div>

          <div className="flex items-center gap-5 mt-auto">
            <span className="font-sans text-[14px] text-white/70">System capacity</span>
            <div className="flex-1 h-[3px] bg-[#2a2a2a] relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${capacityPercentage}%` }}
                transition={{ duration: 1, ease: "circOut" }}
                className="absolute left-0 top-0 bottom-0 bg-white rounded-full" 
              />
            </div>
            <span className="font-mono text-[20px] font-medium text-white">{capacityPercentage}%</span>
          </div>
        </div>

        {/* Quick Actions / Recommendations (Col Span 3) */}
        <div className="lg:col-span-3 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 flex flex-col min-h-[460px]">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-sans text-[22px] font-medium text-white">Recommendations</h2>
            <button className="text-white/50 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <p className="font-sans text-[14px] text-white/50 mb-8">Personalized tips to accelerate your job search</p>

          <div className="space-y-4 flex-1 flex flex-col">
            <div className="bg-[#e6efdf] rounded-[16px] p-6 flex-[1.2] flex flex-col justify-between cursor-pointer hover:opacity-95 transition-opacity">
              <p className="font-sans text-[14.5px] font-medium text-[#111] leading-relaxed">
                {DUMMY_QUICK_ACTIONS[0]?.description || "Your CV match rate increased! We recommend tailoring your resume for..."}
              </p>
              <p className="font-sans text-[13px] text-[#111]/60 font-medium">Daily recommendation</p>
            </div>
            
            <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-[16px] p-6 flex-1 flex flex-col justify-between cursor-pointer hover:bg-[#2a2a2a] transition-colors">
              <p className="font-sans text-[14.5px] font-medium text-white leading-relaxed">
                {DUMMY_QUICK_ACTIONS[1]?.description || "Practice behavioral questions for upcoming interviews."}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-sans text-[13px] text-white/40">Action Item</span>
                <span className="font-sans text-[13px] text-white/40">15 min</span>
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
            <p className="font-sans text-[14px] font-medium text-[#111]/60">Avg response time</p>
          </div>
          
          <div className="mt-auto">
            <p className="font-sans text-[56px] font-medium text-[#111] leading-none mb-3">1.2</p>
            <p className="font-sans text-[14px] font-medium text-[#111]/60">seconds</p>
          </div>
        </div>

        {/* Interaction Metrics (Col Span 4) */}
        <div className="lg:col-span-4 bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-sans text-[22px] font-medium text-white">Interaction Metrics</h2>
              <button className="px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-sans text-[13px] tracking-wide flex items-center gap-1.5">
                Week <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <p className="font-sans text-[14px] font-medium text-white/50">Vocal engagement over 7 days</p>
          </div>

          <div className="flex justify-between items-end gap-3 mt-12 overflow-x-auto no-scrollbar">
            {USAGE_DAYS.map((day, i) => {
              const currentVal = USAGE_DATA[i];
              const prevVal = USAGE_DATA[i === 0 ? 0 : i - 1];
              const trend = currentVal > prevVal ? "↑" : currentVal < prevVal ? "↓" : "−";
              const isActive = i === 2;

              return (
                <DayColumn 
                  key={day} 
                  day={day} 
                  trend={trend} 
                  activeNum={currentVal.toString()} 
                  active={isActive} 
                  subLabel="interactions"
                />
              )
            })}
          </div>
        </div>

        {/* Neural Activity (Col Span 6) */}
        <div className="lg:col-span-6 bg-[#e6efdf] rounded-[24px] p-8 flex flex-col justify-between min-h-[320px] relative">
          <div className="flex justify-between items-start w-full">
            <div>
              <h2 className="font-sans text-[22px] font-medium text-[#111] mb-3">Neural Activity</h2>
              <p className="font-sans text-[14px] font-medium text-[#111]/60">Temporal system logs</p>
            </div>
            <button className="px-5 py-2 rounded-full border border-[#111]/30 hover:bg-[#111]/10 transition-colors text-[#111] font-sans text-[14px] tracking-wide font-medium">
              View Log
            </button>
          </div>
          
          <div className="flex items-end justify-between mt-auto">
             <div>
                <p className="font-sans text-[56px] font-medium text-[#111] leading-none mb-4">98.2%</p>
                <p className="font-sans text-[14px] font-medium text-[#111]/50 uppercase tracking-widest">Stability index</p>
             </div>
             
             {/* Timeline Graphic */}
             <div className="flex items-center gap-0 w-max overflow-x-auto no-scrollbar pb-2 pt-6 shrink-0">
                <TimelineDot time="11:42" active={false} label="SYNC" />
                <TimelineLine active={true} />
                <TimelineDot time="12:05" active={true} filled={true} label="CORE" />
                <TimelineLine active={true} />
                <TimelineDot time="13:14" active={true} filled={true} label="NODE" />
                <TimelineLine active={true} />
                <TimelineDot time="14:55" active={true} filled={true} label="DATA" />
                <TimelineLine active={false} />
                <TimelineDot time="16:00" active={false} label="IDLE" />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DayColumn({ day, trend, activeNum, active, subLabel = "req" }: { day: string, trend: string, activeNum: string, active: boolean, subLabel?: string }) {
  return (
    <div className="flex flex-col flex-1 items-center shrink-0 min-w-[36px]">
      <div className="flex items-center gap-1 mb-6">
         <span className="font-sans text-[13px] font-medium text-white/50">{day}</span>
         <span className="text-[12px] text-white/50">{trend}</span>
      </div>
      
      <div className="flex flex-col items-center gap-1 mb-5 opacity-50 text-left w-full pl-2">
         <span className="font-sans text-[13px] text-white leading-none font-medium">{activeNum}</span>
         <span className="font-sans text-[11px] text-white">{subLabel}</span>
      </div>

      <div className={`w-full rounded-sm h-[8px] overflow-hidden flex ${active ? 'bg-white' : 'bg-[#1f1f1f]'}`}>
      </div>
    </div>
  )
}

function VoiceAgentVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bars = gsap.utils.toArray<HTMLElement>('.voice-bar');
    
    // Create a wave effect
    bars.forEach((bar, i) => {
      gsap.to(bar, {
        height: 'random(20, 100)%',
        duration: 'random(0.4, 1.2)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.05
      });

      // Subtle glow animation
      gsap.to(bar, {
        opacity: 'random(0.4, 1)',
        duration: 'random(0.5, 1.5)',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-t from-white/[0.02] to-transparent rounded-[20px] border border-white/[0.05]">
      <div className="flex items-end gap-[6px] h-32 perspective-[1000px]">
        {Array.from({ length: 18 }).map((_, i) => (
          <div 
            key={i} 
            className="voice-bar w-[6px] bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] origin-bottom"
            style={{ 
              opacity: 0.3 + (i / 18) * 0.4,
              boxShadow: i % 3 === 0 ? '0 0 15px rgba(230,239,223,0.3)' : 'none',
              backgroundColor: i % 3 === 0 ? '#e6efdf' : 'white'
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineDot({ time, active, filled, label }: { time: string, active: boolean, filled?: boolean, label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 relative z-10 w-12 shrink-0">
      <div className={`w-8 h-8 rounded-full flex flex-col items-center justify-center border transition-all duration-500 ${active ? 'border-[#111] bg-[#111]' : 'border-[#111]/20 bg-transparent'}`}>
        {label && <span className={`text-[7px] font-black tracking-tighter ${active ? 'text-white' : 'text-[#111]/30'}`}>{label}</span>}
      </div>
      <span className={`font-mono text-[10px] font-bold transition-colors ${active ? 'text-[#111]' : 'text-[#111]/40'}`}>
        {time}
      </span>
    </div>
  )
}

function TimelineLine({ active }: { active?: boolean }) {
  return (
    <div className={`min-w-[40px] flex-1 h-[1px] transition-colors ${active ? 'bg-[#111]' : 'bg-transparent border-t border-dashed border-[#111]/30'} mx-[-6px] z-0 -translate-y-[22px] shrink-0`} style={!active ? { backgroundImage: 'linear-gradient(to right, #111 50%, transparent 50%)', backgroundSize: '6px 1px', backgroundRepeat: 'repeat-x', backgroundColor: 'transparent' } : {}} />
  )
}

function MiniChart({ title, trend, range, icon: Icon, subLabel = "Units used" }: { title: string, trend: string, range: string, icon?: any, subLabel?: string }) {
  // We expand the array a bit to give more density like the reference image
  const leftBars = [30, 45, 35, 50, 45, 30, 40, 55, 60, 45, 35, 75, 80, 65, 50];
  const rightBars = [20, 25, 30, 50, 100, 95, 80, 85, 90, 85, 80, 90, 85, 80, 75];

  return (
    <div className="flex flex-col h-full min-h-[160px]">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-2">
            {Icon && <Icon size={14} className="text-white/40" />}
            <span className="font-sans text-[14px] font-medium text-white/50 truncate pr-2">{title} <span className="text-white ml-2">{trend}</span></span>
         </div>
         <button className="shrink-0 opacity-30 hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4 text-white" /></button>
      </div>

      <div className="flex-1 flex items-end justify-between gap-[2px] mb-8 pb-3 min-h-[140px]">
        <div className="flex items-end gap-[1.5px] h-full flex-1 opacity-10">
          {leftBars.map((height, i) => (
            <div key={`l-${i}`} className="flex-1 bg-white rounded-t-[1px]" style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="w-3 shrink-0" />
        <div className="flex items-end gap-[1.5px] h-full flex-1">
          {rightBars.map((height, i) => (
            <div key={`r-${i}`} className="flex-1 bg-white rounded-t-[1px] shadow-[0_0_12px_rgba(255,255,255,0.15)]" style={{ height: `${height * 0.8}%` }} />
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <p className="font-sans text-[44px] font-normal text-white leading-none tracking-tight mb-3">{range}</p>
        <p className="font-sans text-[11px] font-bold text-white/30 tracking-widest uppercase">{subLabel}</p>
      </div>
    </div>
  )
}
