"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Sparkles, Plus, History, ArrowLeft } from "lucide-react";
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
    setIsModalOpen(true);
  }, []);

  const handleAnalysisComplete = (data: CvAnalysisResponseDTO, file: File) => {
    setAnalysisResult(data);
    setUploadedFile(file);
    setIsModalOpen(false);
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <FileSearch className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--d-text-primary)" }}>
              CV Analysis
            </h1>
          </div>
          <p className="text-[15px] max-w-2xl" style={{ color: "var(--d-text-muted)" }}>
            Precision AI matching between your professional profile and target job descriptions.
          </p>
        </div>

        {analysisResult && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleNewAnalysis}
            icon={<Plus size={18} />}
            className="rounded-2xl h-12 px-6"
          >
            New Analysis
          </Button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {!analysisResult ? (
          <motion.div
            key="empty-state"
            variants={fadeUp}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-[var(--d-surface)] border border-[var(--d-border)] flex items-center justify-center mb-8 shadow-inner">
              <Sparkles className="w-10 h-10 opacity-20" />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--d-text-primary)" }}>
              Ready for Deep Analysis?
            </h2>
            <p className="text-[15px] max-w-md mx-auto mb-8" style={{ color: "var(--d-text-muted)" }}>
              Upload your resume and a job description to see how you stack up against the competition.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl"
            >
              Get Started
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            variants={fadeUp}
          >
            <CVAnalysisResults data={analysisResult} file={uploadedFile!} />
          </motion.div>
        )}
      </AnimatePresence>

      <CVAnalysisModal
        isOpen={isModalOpen}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </motion.div>
  );
}
