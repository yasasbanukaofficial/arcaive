"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Target, 
  Zap, 
  Trophy, 
  Flag, 
  MessageCircle,
  FileText,
  ChevronRight
} from "lucide-react";
import { CvAnalysisResponseDTO } from "../api/cvAnalysisAPI";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface CVAnalysisResultsProps {
  data: CvAnalysisResponseDTO;
  file: File;
}

export default function CVAnalysisResults({ data, file }: CVAnalysisResultsProps) {
  const displayScore = data.overallMatchScore <= 1 ? data.overallMatchScore * 100 : data.overallMatchScore;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--accent-emerald-dot)";
    if (score >= 50) return "var(--accent-amber-dot)";
    return "var(--accent-red-dot)";
  };

  const getSeniorityColor = (fit: string) => {
    switch (fit) {
      case "IDEAL": return "green";
      case "OVERQUALIFIED": return "purple";
      case "UNDERQUALIFIED": return "red";
      default: return "default";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-[var(--d-surface)] to-[var(--d-surface-active)]">
            <div className="p-8 relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Target size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="blue">Analysis Verdict</Badge>
                  <Badge variant={getSeniorityColor(data.seniorityFit) as any}>
                    {data.seniorityFit.replace(/_/g, " ")}
                  </Badge>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-4 leading-tight">
                  {data.targetJobTitle}
                </h2>
                <p className="text-lg leading-relaxed opacity-80 max-w-2xl">
                  {data.semanticVerdict}
                </p>
                
                <div className="mt-8 flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-50 mb-1">Match Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black" style={{ color: getScoreColor(displayScore) }}>
                        {Math.round(displayScore)}
                      </span>
                      <span className="text-xl font-bold opacity-30">%</span>
                    </div>
                  </div>
                  
                  <div className="w-[1px] h-12 bg-[var(--d-border-subtle)]" />
                  
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-50 mb-1">Seniority Match</span>
                    <span className="text-xl font-bold">{data.seniorityFit.charAt(0) + data.seniorityFit.slice(1).toLowerCase().replace(/_/g, " ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Matched Skills" icon={<CheckCircle2 className="text-emerald-500" />} className="h-full">
              <div className="flex flex-wrap gap-2">
                {data.skillGap.matchedSkills.map((skill, i) => (
                  <Badge key={i} variant="green" className="px-3 py-1.5 rounded-xl">{skill}</Badge>
                ))}
              </div>
            </Card>

            <Card title="Missing Essentials" icon={<XCircle className="text-red-500" />} className="h-full">
              <div className="flex flex-wrap gap-2">
                {data.skillGap.missingEssentials.map((skill, i) => (
                  <Badge key={i} variant="red" className="px-3 py-1.5 rounded-xl">{skill}</Badge>
                ))}
                {data.skillGap.missingEssentials.length === 0 && (
                  <p className="text-[13px] opacity-50 italic">No critical skills missing.</p>
                )}
              </div>
            </Card>
          </div>

          <Card title="Bonus & Extras" icon={<Zap className="text-amber-500" />}>
            <div className="flex flex-wrap gap-2">
              {data.skillGap.bonusSkills.map((skill, i) => (
                <Badge key={i} variant="yellow" className="px-3 py-1.5 rounded-xl">{skill}</Badge>
              ))}
              {data.skillGap.bonusSkills.length === 0 && (
                <p className="text-[13px] opacity-50 italic">No bonus skills detected.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Red Flags" icon={<Flag className="text-red-500" />}>
            <div className="space-y-3">
              {data.redFlags.map((flag, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[13px] font-medium leading-relaxed opacity-90">{flag}</p>
                </div>
              ))}
              {data.redFlags.length === 0 && (
                <p className="text-[13px] opacity-50 italic">No red flags identified.</p>
              )}
            </div>
          </Card>

          <Card title="Interview Probes" icon={<MessageCircle className="text-blue-500" />}>
            <div className="space-y-4">
              {data.interviewProbes.map((probe, i) => (
                <div key={i} className="group flex gap-3 p-4 rounded-2xl bg-[var(--d-surface-active)] hover:bg-[var(--d-surface-hover)] transition-colors border border-transparent hover:border-[var(--d-border-subtle)]">
                  <ChevronRight size={16} className="text-blue-500 shrink-0 mt-1" />
                  <p className="text-[14px] font-medium leading-relaxed italic">{probe}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Uploaded Document" icon={<FileText className="text-[var(--d-text-tertiary)]" />}>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--d-surface-active)]">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold truncate">{file.name}</p>
                <p className="text-[12px] opacity-50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
