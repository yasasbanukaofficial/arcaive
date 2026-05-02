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
      className="space-y-12"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-12 items-start p-8 oryzo-card-glow" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
        <div className="flex flex-col">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">MATCH SCORE</span>
          <div className="font-sans text-[80px] font-bold leading-none text-[var(--text-primary)]">
            {displayScore}<span className="text-[32px] opacity-20">%</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-4 pt-4">
          <div className="inline-block font-mono text-[10px] border border-[var(--glass-border)] px-2 py-1 uppercase tracking-widest mb-4 bg-[var(--bg-color)]">
            AI VERDICT: {data.seniorityFit?.replace(/_/g, " ")}
          </div>
          <h2 className="font-sans text-[32px] font-bold leading-tight uppercase text-[var(--text-primary)]">
            {data.targetJobTitle}
          </h2>
          <p className="font-sans text-[18px] text-[var(--text-secondary)] leading-relaxed max-w-2xl italic">
            &quot;{data.semanticVerdict}&quot;
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          {/* Section Scores */}
          <div className="space-y-6">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">DIMENSIONAL ALIGNMENT</h3>
            <div className="space-y-4 border-t border-[var(--glass-border)] pt-6">
              {[
                { label: "Technical Skills", value: Math.round(data.skillGap?.technicalAlignmentScore * 100 || 0) },
                { label: "Experience Relevance", value: displayScore },
                { label: "Critical Flags", value: data.redFlags?.length || 0, isCount: true }
              ].map((item, idx) => (
                <div key={idx} className="group flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <span className="font-sans text-[14px] font-bold uppercase text-[var(--text-primary)]">{item.label}</span>
                    {!item.isCount && (
                      <div className="h-1 w-32 bg-[var(--glass-border)] overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                          className="h-full bg-[var(--text-primary)]"
                        />
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[18px] font-bold text-[var(--text-primary)]">
                    {item.value}{!item.isCount && "%"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Tabs */}
          <div className="space-y-8">
            <div className="flex gap-8 border-b border-[var(--glass-border)]">
              <button 
                onClick={() => setActiveTab("strengths")}
                className={`px-4 py-2 font-bold text-[12px] tracking-wide whitespace-nowrap transition-all rounded-[var(--radius)]
                  ${activeTab === "strengths" 
                    ? "bg-black text-white" 
                    : "bg-transparent text-[var(--text-secondary)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] hover:text-[var(--text-primary)]"}`}
              >
                Core Strengths
              </button>
              <button 
                onClick={() => setActiveTab("weaknesses")}
                className={`px-4 py-2 font-bold text-[12px] tracking-wide whitespace-nowrap transition-all rounded-[var(--radius)]
                  ${activeTab === "weaknesses" 
                    ? "bg-black text-white" 
                    : "bg-transparent text-[var(--text-secondary)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] hover:text-[var(--text-primary)]"}`}
              >
                Skill Gaps
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === "strengths" ? (
                <ul className="space-y-3">
                  {data.skillGap?.matchedSkills?.map((skill, i) => (
                    <li key={i} className="font-sans text-[15px] flex items-start gap-3">
                      <span className="text-[var(--text-secondary)]">—</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                  {(!data.skillGap?.matchedSkills || data.skillGap.matchedSkills.length === 0) && (
                    <p className="font-sans text-[14px] text-[var(--text-secondary)] italic">No specific strengths highlighted.</p>
                  )}
                </ul>
              ) : (
                <ul className="space-y-3">
                  {data.skillGap?.missingEssentials?.map((skill, i) => (
                    <li key={i} className="font-sans text-[15px] flex items-start gap-3">
                      <span className="text-[#D83B2A]">—</span>
                      <span className="text-[#D83B2A]">{skill}</span>
                    </li>
                  ))}
                  {(!data.skillGap?.missingEssentials || data.skillGap.missingEssentials.length === 0) && (
                    <p className="font-sans text-[14px] text-[var(--text-secondary)] italic">No critical skill gaps detected.</p>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">EXPECTED INTERVIEW PROBES</h3>
            <div className="space-y-4">
              {data.interviewProbes?.map((probe, i) => (
                <div key={i} className="p-6 border border-[var(--glass-border)] bg-[var(--bg-color)] font-sans text-[15px] leading-relaxed text-[var(--text-secondary)] oryzo-card-glow hover:text-[var(--text-primary)] transition-colors">
                  &quot;{probe}&quot;
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border border-[var(--glass-border)] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">Document ID</span>
              <span className="font-mono text-[11px] uppercase">{file?.name?.split('.').pop()}</span>
            </div>
            <div className="font-sans text-[14px] font-bold uppercase truncate">
              {file?.name}
            </div>
            <div className="aspect-[1/1.4] w-full border border-[var(--glass-border)] bg-[var(--bg-color)] overflow-hidden oryzo-card-glow">
              {pdfUrl ? (
                <iframe 
                  src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"} 
                  className="w-full h-full border-none grayscale invert contrast-[1.1]"
                  title="CV Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-[11px] text-[var(--text-secondary)]">
                  NO PREVIEW
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button 
                className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-[var(--glass-border)]"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius)",
                }}
                onClick={() => window.open(pdfUrl || "", "_blank")}
              >
                EXPAND
              </button>
              <button 
                className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-80"
                style={{
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  borderRadius: "var(--radius)",
                }}
                onClick={() => window.location.reload()}
              >
                RESET
              </button>
            </div>
          </div>

          {/* Red Flags Section */}
          {data.redFlags?.length > 0 && (
            <div className="border border-[#D83B2A] p-8 space-y-4">
               <span className="font-mono text-[11px] uppercase tracking-widest text-[#D83B2A]">Critical Red Flags</span>
              <ul className="space-y-3">
                {data.redFlags.map((flag, i) => (
                  <li key={i} className="font-sans text-[14px] text-[#D83B2A] flex items-start gap-3">
                    <span>!</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
