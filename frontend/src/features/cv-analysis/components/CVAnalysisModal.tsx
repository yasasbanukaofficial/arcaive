"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FileUpload, { UploadedFile, FileUploadStatus } from "@/components/ui/FileUpload";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { cvAnalysisAPI, CvAnalysisResponseDTO } from "../api/cvAnalysisAPI";
import { useToast } from "@/components/ui/Toast";

import CVAnalysisLoading from "./CVAnalysisLoading";

interface CVAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (data: CvAnalysisResponseDTO, file: File) => void;
  initialJobDescription?: string;
}

export default function CVAnalysisModal({ 
  isOpen, 
  onClose,
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
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" style={{ backgroundColor: "var(--d-bg-alpha, rgba(0,0,0,0.4))" }} onClick={() => status !== "uploading" && onClose()} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: "var(--d-surface)",
            borderColor: "var(--d-border)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
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
                className="relative z-10 p-5 sm:p-8 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-medium" style={{ color: "var(--d-text-primary)" }}>
                    Analysis Configuration
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: "var(--d-text-muted)" }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-sm" style={{ color: "var(--d-text-muted)" }}>
                  Provide your credentials and the target role description for semantic alignment.
                </p>

                <div className="space-y-5">
                  <FileUpload
                    label="Your Professional CV"
                    files={files}
                    onFilesChange={setFiles}
                    status={status}
                    progress={progress}
                    maxSizeMB={5}
                    disabled={status === "uploading"}
                  />

                  <TextArea
                    label="Target Job Description"
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    disabled={status === "uploading"}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full h-11 sm:h-12 text-sm font-medium rounded-xl"
                    onClick={handleAnalyze}
                    disabled={files.length === 0 || !jobDescription.trim() || status === "uploading"}
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
