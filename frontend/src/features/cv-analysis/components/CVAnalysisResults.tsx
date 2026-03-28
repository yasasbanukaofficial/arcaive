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
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function CVAnalysisResults({ data, file }: CVAnalysisResultsProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

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
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--accent-emerald-dot)";
    if (score >= 60) return "var(--accent-blue-dot)";
    if (score >= 40) return "var(--accent-amber-dot)";
    return "var(--accent-red-dot)";
  };

  const getSeniorityBadge = (fit: string) => {
    const f = fit?.toUpperCase() || "";
    if (f.includes("IDEAL") || f.includes("MATCH")) return { color: "var(--accent-emerald-dot)", bg: "var(--accent-emerald-bg)", border: "var(--accent-emerald-border)" };
    if (f.includes("OVER")) return { color: "var(--accent-purple-dot)", bg: "var(--accent-purple-bg)", border: "var(--accent-purple-border)" };
    if (f.includes("UNDER")) return { color: "var(--accent-amber-dot)", bg: "var(--accent-amber-bg)", border: "var(--accent-amber-border)" };
    return { color: "var(--accent-blue-dot)", bg: "var(--accent-blue-bg)", border: "var(--accent-blue-border)" };
  };

  const seniority = getSeniorityBadge(data.seniorityFit);

  if (!data) return null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="relative rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden"
        style={{
          backgroundColor: "var(--d-surface)",
          border: "1px solid var(--d-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
          <div className="shrink-0 relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                stroke="var(--d-surface-hover)"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="50" cy="50" r="42"
                stroke={getScoreColor(displayScore)}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={263.89}
                initial={{ strokeDashoffset: 263.89 }}
                animate={{ strokeDashoffset: 263.89 - (263.89 * displayScore) / 100 }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-medium" style={{ color: "var(--d-text-primary)" }}>
                {displayScore}<span className="text-lg sm:text-xl lg:text-2xl opacity-40">%</span>
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ backgroundColor: "var(--d-surface-hover)", borderColor: "var(--d-border)", color: "var(--d-text-muted)" }}>
                AI Alignment Verdict
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ backgroundColor: seniority.bg, borderColor: seniority.border, color: seniority.color }}>
                {data.seniorityFit?.replace(/_/g, " ")}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold" style={{ color: "var(--d-text-primary)" }}>
              {data.targetJobTitle}
            </h1>

            <p className="text-sm sm:text-base font-medium" style={{ color: "var(--d-text-muted)" }}>
              &quot;{data.semanticVerdict}&quot;
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-sm font-medium">
              <div className="px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm"
                   style={{ backgroundColor: "var(--d-surface-hover)", borderColor: "var(--d-border)", color: "var(--d-text-secondary)" }}>
                Skill: {Math.round(data.skillGap?.technicalAlignmentScore * 100 || 0)}%
              </div>
              <div className="px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm"
                   style={{ 
                     backgroundColor: data.redFlags?.length > 0 ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                     borderColor: data.redFlags?.length > 0 ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                     color: data.redFlags?.length > 0 ? "#ef4444" : "#10b981"
                   }}>
                {data.redFlags?.length || 0} Flags
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm sm:text-base font-medium uppercase tracking-wide" style={{ color: "var(--d-text-muted)" }}>
              Skill Alignment Matrix
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { 
                  label: "Matched", 
                  items: data.skillGap?.matchedSkills, 
                  textColor: "#34d399",
                  bgColor: "rgba(52, 211, 153, 0.1)",
                  borderColor: "rgba(52, 211, 153, 0.2)"
                },
                { 
                  label: "Missing", 
                  items: data.skillGap?.missingEssentials, 
                  textColor: "#f87171",
                  bgColor: "rgba(248, 113, 113, 0.1)",
                  borderColor: "rgba(248, 113, 113, 0.2)"
                },
                { 
                  label: "Bonus", 
                  items: data.skillGap?.bonusSkills, 
                  textColor: "#fb923c",
                  bgColor: "rgba(251, 146, 60, 0.1)",
                  borderColor: "rgba(251, 146, 60, 0.2)"
                }
              ].map((group, idx) => (
                <div key={idx} className="rounded-xl p-4 sm:p-5 space-y-3" style={{ backgroundColor: "var(--d-surface)", border: "1px solid var(--d-border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--d-text-muted)" }}>{group.label}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md" style={{ color: group.textColor, backgroundColor: group.bg }}>
                      {group.items?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items?.map((s, i) => (
                      <span key={i} className="px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:bg-white/5"
                            style={{ borderColor: group.borderColor, color: group.textColor, backgroundColor: group.bg }}>
                        {s}
                      </span>
                    ))}
                    {(!group.items || group.items.length === 0) && (
                      <p className="text-xs py-2" style={{ color: "var(--d-text-muted)" }}>None detected</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-sm sm:text-base font-medium uppercase tracking-wide" style={{ color: "var(--d-text-muted)" }}>
                Critical Red Flags
              </h3>
              <div className="rounded-xl p-4 sm:p-5 space-y-3" style={{ backgroundColor: "var(--d-surface)", border: "1px solid var(--d-border)" }}>
                {data.redFlags?.length > 0 ? data.redFlags.map((flag, i) => (
                  <div key={i} className="p-3 rounded-lg border flex gap-3 items-start group hover:bg-white/5 transition-colors"
                       style={{ borderColor: "rgba(239, 68, 68, 0.2)", backgroundColor: "rgba(239, 68, 68, 0.05)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--d-text-secondary)" }}>{flag}</p>
                  </div>
                )) : (
                  <div className="py-6 text-center text-xs font-medium" style={{ color: "var(--d-text-muted)" }}>No Flags Detected</div>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-sm sm:text-base font-medium uppercase tracking-wide" style={{ color: "var(--d-text-muted)" }}>
                Interview Probes
              </h3>
              <div className="rounded-xl p-4 sm:p-5 space-y-3" style={{ backgroundColor: "var(--d-surface)", border: "1px solid var(--d-border)" }}>
                {data.interviewProbes?.map((probe, i) => (
                  <div key={i} className="p-3 rounded-lg border group hover:bg-white/5 transition-colors"
                       style={{ borderColor: "var(--d-border-subtle)" }}>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--d-text-muted)" }}>&quot;{probe}&quot;</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <motion.div variants={itemVariants} className="rounded-2xl p-4 sm:p-6 space-y-4 overflow-hidden"
                      style={{ backgroundColor: "var(--d-surface)", border: "1px solid var(--d-border)" }}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
                   style={{ backgroundColor: "var(--d-surface-hover)", border: "1px solid var(--d-border-subtle)" }}>
                <span className="text-base sm:text-lg font-medium" style={{ color: "var(--d-text-muted)" }}>CV</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-medium truncate uppercase">{file?.name}</h3>
                <p className="text-xs font-medium" style={{ color: "var(--d-text-muted)" }}>
                  {(file?.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="aspect-[1/1.2] w-full rounded-xl border relative overflow-hidden bg-black/10"
                 style={{ borderColor: "var(--d-border-subtle)" }}>
              {pdfUrl ? (
                <iframe 
                  src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"} 
                  className="w-full h-full border-none opacity-70"
                  title="CV Preview"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className="text-xs font-medium uppercase" style={{ color: "var(--d-text-muted)" }}>No Preview</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary" 
                size="lg" 
                className="rounded-xl font-medium text-xs sm:text-sm h-10 sm:h-11 border"
                onClick={() => window.open(pdfUrl || "", "_blank")}
              >
                Expand
              </Button>
              <Button 
                variant="primary" 
                size="lg" 
                className="rounded-xl font-medium text-xs sm:text-sm h-10 sm:h-11"
                onClick={() => window.location.reload()}
              >
                Reset
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
