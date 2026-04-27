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
        <div className="absolute inset-0 bg-black/70" onClick={() => status !== "uploading" && onClose()} />
        
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="relative w-full max-w-[560px] bg-white border border-[#E8E6DE] overflow-hidden"
          style={{ borderRadius: 0 }}
        >
          <AnimatePresence mode="wait">
            {status === "uploading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-[48px]"
              >
                <CVAnalysisLoading />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 flex flex-col"
              >
                <div className="flex items-center justify-between px-[48px] py-6">
                  <h2 className="font-sans text-[20px] font-bold text-black uppercase">
                    Analysis Config.
                  </h2>
                  <button
                    onClick={onClose}
                    className="font-mono text-[18px] text-black hover:opacity-60 transition-opacity"
                  >
                    ×
                  </button>
                </div>
                <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />

                <div className="p-[48px] space-y-8">
                  <FileUpload
                    label="YOUR_RESUME_DOC"
                    files={files}
                    onFilesChange={setFiles}
                    status={status}
                    progress={progress}
                    maxSizeMB={5}
                    disabled={status === "uploading"}
                  />

                  <TextArea
                    label="TARGET_JOB_DESCRIPTION"
                    placeholder="PASTE_TEXT_HERE"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                    disabled={status === "uploading"}
                  />
                </div>

                <div className="mt-4">
                  <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />
                  <div className="px-[48px] py-8 flex justify-end gap-4">
                    <button
                      className="btn-ghost"
                      onClick={onClose}
                      disabled={status === "uploading"}
                    >
                      CANCEL
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleAnalyze}
                      disabled={files.length === 0 || !jobDescription.trim() || status === "uploading"}
                    >
                      RUN ANALYSIS
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
