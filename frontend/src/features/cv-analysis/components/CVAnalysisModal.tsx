"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, X, Sparkles, AlertCircle } from "lucide-react";
import FileUpload, { UploadedFile, FileUploadStatus } from "@/components/ui/FileUpload";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { cvAnalysisAPI, CvAnalysisResponseDTO } from "../api/cvAnalysisAPI";
import { useToast } from "@/components/ui/Toast";

import CVAnalysisLoading from "./CVAnalysisLoading";

interface CVAnalysisModalProps {
  isOpen: boolean;
  onAnalysisComplete: (data: CvAnalysisResponseDTO, file: File) => void;
  initialJobDescription?: string;
}

export default function CVAnalysisModal({ 
  isOpen, 
  onAnalysisComplete, 
  initialJobDescription = "" 
}: CVAnalysisModalProps) {
  const { addToast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [status, setStatus] = useState<FileUploadStatus>("idle");
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (initialJobDescription) {
      setJobDescription(initialJobDescription);
    }
  }, [initialJobDescription]);

  const handleAnalyze = async () => {
    if (files.length === 0 || !jobDescription.trim()) return;

    setStatus("uploading");
    setProgress(10);
    
    try {
      const result = await cvAnalysisAPI.analyze(files[0].file, jobDescription);
      setStatus("success");
      
      setTimeout(() => {
        onAnalysisComplete(result, files[0].file);
      }, 800);
    } catch (error) {
      setStatus("error");
      addToast({
        type: "error",
        title: "Analysis Failed",
        description: "Something went wrong during CV analysis. Please try again.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--d-surface)",
            borderColor: "var(--d-border)",
          }}
        >
          <AnimatePresence mode="wait">
            {status === "uploading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CVAnalysisLoading />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 space-y-6"
              >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full" />
                
                <div className="relative z-10 space-y-6">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
                      style={{ 
                        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      }}
                    >
                      <FileSearch size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--d-text-primary)" }}>
                      CV Intelligence Analysis
                    </h2>
                    <p className="text-[14px] mt-1" style={{ color: "var(--d-text-muted)" }}>
                      Upload your CV and provide a target job description to get AI-powered insights.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FileUpload
                      label="Your CV / Resume"
                      files={files}
                      onFilesChange={setFiles}
                      status={status}
                      progress={progress}
                      maxSizeMB={5}
                      disabled={status === "uploading"}
                    />

                    <TextArea
                      label="Target Job Description"
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={5}
                      disabled={status === "uploading"}
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full h-14 text-[16px] font-bold rounded-2xl"
                    onClick={handleAnalyze}
                    disabled={files.length === 0 || !jobDescription.trim() || status === "uploading"}
                    icon={<Sparkles size={18} />}
                  >
                    Start Analysis
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
