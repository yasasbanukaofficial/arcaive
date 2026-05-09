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

  useEffect(() => {
    if (file && file instanceof File) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
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
      <motion.div variants={itemVariants} className="bg-[#161616] border border-[#2a2a2a] rounded-[32px] overflow-hidden">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#2a2a2a]">
          <div className="p-8 lg:p-12 flex flex-col items-center justify-center lg:min-w-[300px] bg-[#e6efdf] text-[#111]">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 mb-4">MATCH SCORE</span>
            <div className="font-sans text-[84px] font-bold leading-none tracking-tighter">
              {displayScore}<span className="text-[32px] opacity-40">%</span>
            </div>
            <div className="mt-6 px-4 py-1.5 rounded-full bg-[#111] text-[#e6efdf] text-[10px] font-bold tracking-widest uppercase">
              {data.seniorityFit?.replace(/_/g, " ")}
            </div>
          </div>
          
          <div className="p-8 lg:p-12 flex-1 space-y-6">
            <div className="space-y-2">
              <h2 className="font-sans text-[32px] font-medium tracking-tight text-white leading-tight">
                {data.targetJobTitle}
              </h2>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#e6efdf]" />
                <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">SEMANTIC VERDICT</span>
              </div>
            </div>
            <p className="font-sans text-[18px] text-white/70 leading-relaxed italic max-w-3xl">
              &quot;{data.semanticVerdict}&quot;
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          {/* Dimensional Alignment */}
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-[16px] font-medium text-white tracking-tight">Dimensional Alignment</h3>
              <div className="w-10 h-[1px] bg-[#2a2a2a]" />
            </div>
            
            <div className="space-y-8">
              {[
                { label: "Technical Skills", value: Math.round(data.skillGap?.technicalAlignmentScore * 100 || 0) },
                { label: "Experience Relevance", value: displayScore },
                { label: "Critical Flags", value: data.redFlags?.length || 0, isCount: true }
              ].map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[13px] font-medium text-white/60 tracking-wide uppercase">{item.label}</span>
                    <span className="font-mono text-[18px] font-medium text-white">
                      {item.value}{!item.isCount && "%"}
                    </span>
                  </div>
                  {!item.isCount && (
                    <div className="h-[2px] w-full bg-[#2a2a2a] overflow-hidden rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1.2, delay: 0.5 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-[#e6efdf] shadow-[0_0_10px_rgba(230,239,223,0.3)]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Tabs */}
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-[24px] overflow-hidden">
            <div className="flex border-b border-[#2a2a2a]">
              <button 
                onClick={() => setActiveTab("strengths")}
                className={`flex-1 px-6 py-5 font-sans text-[13px] font-medium tracking-wide transition-all
                  ${activeTab === "strengths" 
                    ? "bg-[#1f1f1f] text-white border-b-2 border-[#e6efdf]" 
                    : "text-white/30 hover:text-white/50 hover:bg-[#1a1a1a]"}`}
              >
                Core Strengths
              </button>
              <button 
                onClick={() => setActiveTab("weaknesses")}
                className={`flex-1 px-6 py-5 font-sans text-[13px] font-medium tracking-wide transition-all
                  ${activeTab === "weaknesses" 
                    ? "bg-[#1f1f1f] text-[#ff6b6b] border-b-2 border-[#ff6b6b]" 
                    : "text-white/30 hover:text-white/50 hover:bg-[#1a1a1a]"}`}
              >
                Skill Gaps
              </button>
            </div>

            <div className="p-8">
              {activeTab === "strengths" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.skillGap?.matchedSkills?.map((skill, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[16px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#e6efdf]" />
                      <span className="font-sans text-[14px] text-white/80">{skill}</span>
                    </div>
                  ))}
                  {(!data.skillGap?.matchedSkills || data.skillGap.matchedSkills.length === 0) && (
                    <p className="font-sans text-[14px] text-white/30 italic">No specific strengths highlighted.</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.skillGap?.missingEssentials?.map((skill, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-[#1a1a1a] border border-[#ff6b6b]/20 rounded-[16px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b]" />
                      <span className="font-sans text-[14px] text-[#ff6b6b]/80">{skill}</span>
                    </div>
                  ))}
                  {(!data.skillGap?.missingEssentials || data.skillGap.missingEssentials.length === 0) && (
                    <p className="font-sans text-[14px] text-white/30 italic">No critical skill gaps detected.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">EXPECTED INTERVIEW PROBES</span>
              <div className="flex-1 h-[1px] bg-[#2a2a2a]" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {data.interviewProbes?.map((probe, i) => (
                <div key={i} className="p-6 border border-[#2a2a2a] bg-[#161616] rounded-[24px] font-sans text-[15px] leading-relaxed text-white/60 hover:text-white hover:border-[#3a3a3a] transition-all group">
                  <div className="flex gap-4">
                    <span className="font-mono text-[#e6efdf] opacity-40 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                    &quot;{probe}&quot;
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">DOCUMENT SOURCE</span>
                <p className="font-sans text-[14px] font-medium text-white truncate max-w-[200px]">{file?.name}</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] font-mono text-[10px] text-[#e6efdf] uppercase tracking-widest">
                {file?.name?.split('.').pop()}
              </div>
            </div>

            <div className="aspect-[1/1.4] w-full border border-[#2a2a2a] bg-[#0d0d0d] overflow-hidden rounded-[16px] relative group shadow-inner">
              {pdfUrl ? (
                <iframe 
                  src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"} 
                  className="w-full h-full border-none grayscale invert contrast-[1.1] opacity-60 group-hover:opacity-100 transition-opacity"
                  title="CV Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-[11px] text-white/10">
                  NO PREVIEW AVAILABLE
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all bg-transparent text-white border border-[#2a2a2a] hover:bg-[#1f1f1f] rounded-full"
                onClick={() => window.open(pdfUrl || "", "_blank")}
              >
                EXPAND PREVIEW
              </button>
              <button 
                className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all bg-[#1a1a1a] text-white/40 hover:text-white border border-[#2a2a2a] rounded-full"
                onClick={() => window.location.reload()}
              >
                RESET ENGINE
              </button>
            </div>
          </div>

          {/* Red Flags Section */}
          {data.redFlags?.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-[24px] p-8 space-y-6">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="font-mono text-[10px] uppercase tracking-widest text-red-500">Critical Red Flags</span>
               </div>
              <div className="space-y-4">
                {data.redFlags.map((flag, i) => (
                  <div key={i} className="font-sans text-[14px] text-red-500/80 flex items-start gap-4 p-4 bg-red-500/5 rounded-[16px] border border-red-500/10">
                    <span className="font-mono text-[12px] opacity-40">!</span>
                    <span>{flag}</span>
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
