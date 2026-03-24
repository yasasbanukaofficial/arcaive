"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Sparkles, Plus, History, ArrowLeft, Brain, Target, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import CVAnalysisModal from "@/features/cv-analysis/components/CVAnalysisModal";
import CVAnalysisResults from "@/features/cv-analysis/components/CVAnalysisResults";
import { CvAnalysisResponseDTO } from "@/features/cv-analysis/api/cvAnalysisAPI";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";

export default function CVAnalysisPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CvAnalysisResponseDTO | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    // Automatically open modal if no result
    if (!analysisResult) {
      setIsModalOpen(true);
    }
  }, []);

  const handleAnalysisComplete = (data: CvAnalysisResponseDTO, file: File) => {
    setUploadedFile(file);
    setAnalysisResult(data);
    // Give a small delay for state to propagate before closing modal
    setTimeout(() => {
      setIsModalOpen(false);
    }, 100);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.06, 0.04)}
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative min-h-[calc(100vh-100px)]"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--d-text-primary)" }}>
              CV Intelligence
            </h1>
          </div>
          <p className="text-[16px] max-w-2xl font-medium opacity-60">
            Precision AI matching between your professional profile and target job descriptions.
          </p>
        </div>

        {analysisResult && (
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleNewAnalysis}
              icon={<History size={18} />}
              className="rounded-2xl h-12 px-6 border-dashed border-2"
            >
              History
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleNewAnalysis}
              icon={<Plus size={18} />}
              className="rounded-2xl h-12 px-6 shadow-xl shadow-blue-500/20"
            >
              New Analysis
            </Button>
          </div>
        )}
      </motion.div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {!analysisResult ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="relative mb-12">
                <div className="w-32 h-32 rounded-[2.5rem] bg-[var(--d-surface)] border border-[var(--d-border)] flex items-center justify-center shadow-2xl relative z-10">
                  <Sparkles className="w-12 h-12 text-blue-500 opacity-80" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 blur-xl rounded-full animate-pulse delay-700" />
              </div>

              <div className="space-y-4 max-w-xl mx-auto mb-12">
                <h2 className="text-3xl font-black" style={{ color: "var(--d-text-primary)" }}>
                  Ready for Deep Analysis?
                </h2>
                <p className="text-[16px] leading-relaxed opacity-60">
                  Upload your resume and a job description to see how you stack up. Our AI engine will analyze skills, seniority, and potential interview questions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
                {[
                  { icon: Brain, label: "Skill Matching", color: "text-blue-500" },
                  { icon: Target, label: "Seniority Fit", color: "text-emerald-500" },
                  { icon: ShieldCheck, label: "Red Flag Detection", color: "text-red-500" }
                ].map((feature, i) => (
                  <div key={i} className="p-6 rounded-[2rem] bg-[var(--d-surface)] border border-[var(--d-border-subtle)] space-y-3">
                    <feature.icon className={`w-6 h-6 mx-auto ${feature.color}`} />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">{feature.label}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="rounded-2xl h-14 px-12 text-lg font-bold shadow-2xl shadow-blue-500/20"
                icon={<Sparkles size={20} />}
              >
                Get Started
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <CVAnalysisResults data={analysisResult} file={uploadedFile!} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CVAnalysisModal
        isOpen={isModalOpen}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </motion.div>
  );
}
