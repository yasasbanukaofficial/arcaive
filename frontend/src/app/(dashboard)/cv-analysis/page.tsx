"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, History } from "lucide-react";
import Button from "@/components/ui/Button";
import CVAnalysisModal from "@/features/cv-analysis/components/CVAnalysisModal";
import CVAnalysisResults from "@/features/cv-analysis/components/CVAnalysisResults";
import { CvAnalysisResponseDTO } from "@/features/cv-analysis/api/cvAnalysisAPI";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import { jobAPI } from "@/features/jobs/api/jobAPI";

import { 
  DashboardPageWrapper,
  DashboardHeader,
  DashboardGrid,
  DashboardCard,
  DashboardLightCard
} from "@/features/dashboard/components/DashboardLayoutComponents";

export default function CVAnalysisPage() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CvAnalysisResponseDTO | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [initialJobDescription, setInitialJobDescription] = useState("");

  useEffect(() => {
    if (!analysisResult) {
      setIsModalOpen(true);
    }
  }, [analysisResult]);

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    if (jobId) {
      const decodedJobId = decodeURIComponent(jobId);
      
      const fetchJobDetails = async () => {
        try {
          let job = jobAPI.getCachedJob(decodedJobId);
          if (!job) {
            const jobs = await jobAPI.get();
            job = jobs.find((j) => j.id === decodedJobId) || null;
          }
          
          if (job) {
            setInitialJobDescription(job.description);
          }
        } catch (error) {
          console.error("Failed to fetch job for CV analysis:", error);
        }
      };
      
      fetchJobDetails();
    }
  }, [searchParams]);

  const handleAnalysisComplete = (data: CvAnalysisResponseDTO, file: File) => {
    setUploadedFile(file);
    setAnalysisResult(data);
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
    <DashboardPageWrapper>
      <DashboardHeader title="CV analysis" />
      <DashboardGrid>
        <DashboardCard 
          className="lg:col-span-12" 
          title="Analysis Engine"
          action={
            analysisResult && (
              <button
                onClick={handleNewAnalysis}
                className="px-6 py-2 text-[12px] font-bold tracking-widest transition-all hover:opacity-80 text-[#111] bg-[#e6efdf] rounded-full"
              >
                New analysis
              </button>
            )
          }
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              {!analysisResult ? (
                <motion.div
                  key="empty-state"
                  variants={fadeUp}
                  className="relative min-h-[500px] flex items-center justify-center overflow-hidden p-8 sm:p-20 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius)]"
                >
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                       style={{ 
                         backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
                         backgroundSize: '40px 40px' 
                       }} 
                  />
                  
                  <div className="relative z-10 max-w-2xl mx-auto space-y-8 text-center">
                    <div className="space-y-4">
                      <div className="inline-block px-3 py-1 border border-[var(--glass-border)] font-mono text-[10px] tracking-[0.2em] text-[var(--text-secondary)] mb-4">
                        Neural alignment v4.0
                      </div>
                      <h2 className="font-display text-[40px] sm:text-[64px] font-bold leading-[0.9] tracking-tight text-[var(--text-primary)] capitalize">
                        Precision AI <br />profile matching
                      </h2>
                      <p className="text-[16px] sm:text-[18px] text-[var(--text-secondary)] max-w-lg mx-auto">
                        Upload your professional resume and a target job description. Our intelligent engine will perform comprehensive semantic analysis.
                      </p>
                    </div>

                    <div className="pt-8">
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-10 py-5 text-[14px] font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] rounded-full text-[#111] bg-[#e6efdf]"
                        >
                          Start analysis →
                        </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CVAnalysisResults data={analysisResult} file={uploadedFile!} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DashboardCard>
      </DashboardGrid>

      <CVAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
        initialJobDescription={initialJobDescription}
      />
    </DashboardPageWrapper>
  );
}
