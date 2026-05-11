"use client";

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CvAnalysisResponseDTO } from "../api/cvAnalysisAPI";
import Button from "@/components/ui/Button";

interface CVAnalysisResultsProps {
  data: CvAnalysisResponseDTO;
  file: File;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

export default function CVAnalysisResults({ data, file }: CVAnalysisResultsProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"strengths" | "weaknesses">("strengths");
  const { isDark } = useTheme();

  useEffect(() => {
    if (file && file instanceof File) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => { if (url) URL.revokeObjectURL(url); };
    }
  }, [file]);

  const displayScore = useMemo(() => {
    const score = data?.overallMatchScore ?? 0;
    return Math.round(score <= 1 ? score * 100 : score);
  }, [data?.overallMatchScore]);
  
  if (!data) return null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Overview Card */}
      <motion.div variants={itemVariants} className="bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[40px] overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-brand)]/[0.02] to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[var(--glass-border)] relative z-10">
          <div className="p-10 lg:p-16 flex flex-col items-center justify-center lg:min-w-[360px] bg-[var(--accent-brand)] text-[var(--accent-brand-contrast)] shadow-xl relative overflow-hidden group/score">
            <div className="absolute inset-0 bg-white/[0.05] translate-y-full group-hover/score:translate-y-0 transition-transform duration-700" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 mb-6 relative z-10">Operational Match</span>
            <div className="font-sans text-[104px] font-bold leading-none tracking-tighter relative z-10">
              {displayScore}<span className="text-[32px] opacity-40">%</span>
            </div>
            <div className="mt-8 px-6 py-2 rounded-full bg-[var(--bg-color)]/20 border border-white/10 text-[10px] font-bold tracking-widest uppercase relative z-10 backdrop-blur-md">
              Fit: {data.seniorityFit?.replace(/_/g, " ")}
            </div>
          </div>
          
          <div className="p-10 lg:p-16 flex-1 space-y-8 flex flex-col justify-center">
            <div className="space-y-2">
              <h2 className="text-[36px] font-bold tracking-tight text-[var(--text-primary)] leading-tight">
                {data.targetJobTitle}
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-brand)] animate-pulse" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-[var(--text-tertiary)] uppercase">Semantic Protocol Verdict</span>
              </div>
            </div>
            <p className="text-[20px] text-[var(--text-secondary)] leading-relaxed italic max-w-3xl font-medium">
              &quot;{data.semanticVerdict}&quot;
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        <div className="lg:col-span-7 space-y-8">
          {/* Dimensional Alignment */}
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] p-10 space-y-10 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">Dimensional Alignment</h3>
              <div className="w-12 h-[1px] bg-[var(--glass-border)]" />
            </div>
            
            <div className="space-y-10">
              {[
                { label: "Technical Capabilities", value: Math.round(data.skillGap?.technicalAlignmentScore * 100 || 0) },
                { label: "Temporal Experience", value: displayScore },
                { label: "Mission Critical Flags", value: data.redFlags?.length || 0, isCount: true }
              ].map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-end justify-between px-1">
                    <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{item.label}</span>
                    <span className="text-[24px] font-bold text-[var(--text-primary)] tracking-tighter leading-none">
                      {item.value}{!item.isCount && "%"}
                    </span>
                  </div>
                  {!item.isCount && (
                    <div className="h-[4px] w-full bg-[var(--text-primary)]/[0.03] overflow-hidden rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-[var(--accent-brand)] shadow-[0_0_15px_rgba(223,231,216,0.3)] rounded-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Tabs */}
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] overflow-hidden shadow-lg">
            <div className="flex p-2 bg-[var(--text-primary)]/[0.02] border-b border-[var(--glass-border)] gap-2">
              <button 
                onClick={() => setActiveTab("strengths")}
                className={`flex-1 px-6 py-4 rounded-[24px] text-[13px] font-bold tracking-tight transition-all duration-300
                  ${activeTab === "strengths" 
                    ? "bg-[var(--bg-color)] text-[var(--text-primary)] shadow-sm border border-[var(--glass-border)]" 
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/[0.02]"}`}
              >
                Core Competencies
              </button>
              <button 
                onClick={() => setActiveTab("weaknesses")}
                className={`flex-1 px-6 py-4 rounded-[24px] text-[13px] font-bold tracking-tight transition-all duration-300
                  ${activeTab === "weaknesses" 
                    ? "bg-red-500/10 text-red-500 shadow-sm border border-red-500/20" 
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/[0.02]"}`}
              >
                Critical Gaps
              </button>
            </div>

            <div className="p-10">
              {activeTab === "strengths" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.skillGap?.matchedSkills?.map((skill, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-[var(--bg-color)]/40 border border-[var(--glass-border)] rounded-[20px] hover:border-[var(--accent-brand)]/30 transition-colors group">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-brand)] group-hover:scale-150 transition-transform" />
                      <span className="text-[14px] font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{skill}</span>
                    </div>
                  ))}
                  {(!data.skillGap?.matchedSkills || data.skillGap.matchedSkills.length === 0) && (
                    <p className="text-[14px] text-[var(--text-tertiary)] italic font-medium">No specific strengths highlighted.</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.skillGap?.missingEssentials?.map((skill, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-red-500/[0.02] border border-red-500/10 rounded-[20px] hover:border-red-500/30 transition-colors group">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-150 transition-transform" />
                      <span className="text-[14px] font-bold text-red-500/70 group-hover:text-red-500 transition-colors">{skill}</span>
                    </div>
                  ))}
                  {(!data.skillGap?.missingEssentials || data.skillGap.missingEssentials.length === 0) && (
                    <p className="text-[14px] text-[var(--text-tertiary)] italic font-medium">No critical skill gaps detected.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[32px] p-10 space-y-10 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--text-primary)]/[0.01] to-transparent pointer-events-none" />
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-8 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">System Input</span>
                <p className="text-[15px] font-bold text-[var(--text-primary)] truncate max-w-[220px] tracking-tight">{file?.name}</p>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] text-[10px] font-bold text-[var(--accent-brand)] uppercase tracking-widest backdrop-blur-md">
                {file?.name?.split('.').pop()} Node
              </div>
            </div>

            <div className="aspect-[1/1.4] w-full border border-[var(--glass-border)] bg-[var(--bg-color)] overflow-hidden rounded-[24px] relative group shadow-inner transition-all duration-500 hover:scale-[1.01]">
              {pdfUrl ? (
                <iframe 
                  src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"} 
                  className={`w-full h-full border-none opacity-60 group-hover:opacity-100 transition-opacity ${isDark ? 'grayscale invert contrast-[1.1]' : ''}`}
                  title="CV Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">
                  Buffer Empty
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)]/60 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <button 
                className="h-14 flex items-center justify-center text-[11px] font-bold uppercase tracking-widest transition-all bg-[var(--text-primary)] text-[var(--bg-color)] rounded-full shadow-lg hover:opacity-90"
                onClick={() => window.open(pdfUrl || "", "_blank")}
              >
                Expand View
              </button>
              <button 
                className="h-14 flex items-center justify-center text-[11px] font-bold uppercase tracking-widest transition-all bg-transparent text-[var(--text-primary)] border border-[var(--glass-border)] hover:bg-[var(--text-primary)]/[0.05] rounded-full"
                onClick={() => window.location.reload()}
              >
                Reset Engine
              </button>
            </div>
          </div>

          {/* Red Flags Section */}
          {data.redFlags?.length > 0 && (
            <div className="bg-red-500/[0.02] border border-red-500/20 rounded-[32px] p-10 space-y-8 shadow-xl">
               <div className="flex items-center gap-4">
                 <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                 <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-500">System Integrity Alerts</span>
               </div>
              <div className="space-y-4">
                {data.redFlags.map((flag, i) => (
                  <div key={i} className="text-[14px] text-red-500/80 font-medium flex items-start gap-4 p-5 bg-red-500/[0.03] rounded-[24px] border border-red-500/10">
                    <span className="font-bold text-[16px] opacity-40 shrink-0">!</span>
                    <span className="leading-relaxed">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
