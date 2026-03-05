import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileText,
  UploadCloud,
  X,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { useToast } from "@/components/ui/Toast";

type UploadStage = "idle" | "uploading" | "analyzing" | "done";

type CVUploadedFile = {
  name: string;
  size: number;
  type: string;
  file: File;
};

export type ExtractedMember = {
  memberFullName?: string | null;
  memberUsername?: string | null;
  memberEmail?: string | null;
  password?: string | null
};

interface CVResumeUploadProps {
  onExtracted?: (data: ExtractedMember) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function CVResumeUpload({ onExtracted }: CVResumeUploadProps) {
  const { addToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<CVUploadedFile | null>(null);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const completeFlow = useCallback((extracted?: ExtractedMember) => {
    clearProgress();
    setProgress(100);
    setTimeout(() => {
      setStage("done");
      if (extracted && onExtracted) onExtracted(extracted);
    }, 300);
  }, [onExtracted]);

  const runUploadFlow = useCallback(() => {
    setStage("uploading");
    setProgress(0);

    let current = 0;
    progressInterval.current = setInterval(() => {
      current += Math.random() * 6 + 2;
      if (current >= 80) {
        current = 80;
        clearProgress();
        setTimeout(() => {
          setStage("analyzing");
          setProgress(80);
          let ai = 80;
          progressInterval.current = setInterval(() => {
            ai += Math.random() * 1.5 + 0.5;
            if (ai >= 95) {
              ai = 95;
              clearProgress();
            }
            setProgress(Math.round(ai));
          }, 120);
        }, 300);
      } else {
        setProgress(Math.round(current));
      }
    }, 60);
  }, []);

  const handleFiles =  useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const f = fileList[0];
      const maxBytes = 10 * 1024 * 1024;
      if (f.size > maxBytes) return;

      const accepted = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!accepted.includes(f.type) && !f.name.match(/\.(pdf|doc|docx)$/i))
        return;

      setFile({ name: f.name, size: f.size, type: f.type, file: f });
      runUploadFlow();

      try {
      const data = await memberAPI.extractMember(f);
      
      if (!data || (!data.memberFullName && !data.memberEmail)) {
        throw new Error("Not a valid CV");
      }

      completeFlow(data);
    } catch (error) {
      clearProgress();
      setStage("idle");
      setFile(null);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
      addToast({
        type: "error",
        title: "Invalid CV",
        description: "We couldn't extract info from this file. Please ensure it's a valid CV.",
      });
    }
    },
    [runUploadFlow, completeFlow]
  );

  const removeFile = () => {
    clearProgress();
    setFile(null);
    setStage("idle");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => () => clearProgress(), []);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const isProcessing = stage === "uploading" || stage === "analyzing";
  const isDone = stage === "done";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium text-gray-400 ml-1">
          Resume / CV
        </span>

        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(16,185,129,0.12) 100%)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "rgba(167,139,250,0.9)",
          }}
        >
          <Sparkles className="w-3 h-3" />
          AI Powered
        </motion.div>
      </div>

      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isProcessing && inputRef.current?.click()}
        animate={{
          scale: isDragging ? 1.015 : 1,
        }}
        transition={{ duration: 0.15 }}
        className={`relative rounded-2xl px-5 py-7 text-center overflow-hidden transition-all duration-200 ${
          isProcessing ? "cursor-default" : "cursor-pointer"
        }`}
        style={{
          background: isDragging
            ? "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(16,185,129,0.06) 100%)"
            : isDone
            ? "linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(6,182,212,0.04) 100%)"
            : "linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          border: isDragging
            ? "1.5px dashed rgba(139,92,246,0.5)"
            : isDone
            ? "1.5px dashed rgba(16,185,129,0.35)"
            : "1.5px dashed rgba(139,92,246,0.2)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 70%)",
          }}
        />

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(16,185,129,0.1) 100%)",
                  border: "1px solid rgba(139,92,246,0.2)",
                }}
              >
                <UploadCloud className="w-5 h-5" style={{ color: "rgba(167,139,250,0.85)" }} />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(16,185,129,0.1))",
                  }}
                />
              </div>

              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-white/70">
                  {isDragging ? "Drop your resume here" : "Drop your resume or click to upload"}
                </p>
                <p className="text-[11px] text-gray-600">PDF, DOC, DOCX · max 10 MB</p>
              </div>

              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium"
                style={{
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.12)",
                  color: "rgba(52,211,153,0.7)",
                }}
              >
                <Zap className="w-3 h-3" />
                Auto-fills name, email, skills &amp; experience
              </div>
            </motion.div>
          )}

          {(isProcessing || isDone) && file && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <FileText className="w-4.5 h-4.5" style={{ color: "rgba(248,113,113,0.8)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white/70 truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-gray-600">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {!isProcessing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 text-gray-600 hover:text-red-400/70 hover:bg-red-500/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {isDone ? (
                      <CheckCircle2
                        className="w-3.5 h-3.5"
                        style={{ color: "rgba(52,211,153,0.8)" }}
                      />
                    ) : (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                        className="w-3.5 h-3.5"
                      >
                        <Sparkles
                          className="w-3.5 h-3.5"
                          style={{
                            color:
                              stage === "analyzing"
                                ? "rgba(167,139,250,0.9)"
                                : "rgba(96,165,250,0.8)",
                          }}
                        />
                      </motion.div>
                    )}
                    <span
                      className="text-[11px] font-medium"
                      style={{
                        color: isDone
                          ? "rgba(52,211,153,0.8)"
                          : stage === "analyzing"
                          ? "rgba(167,139,250,0.8)"
                          : "rgba(96,165,250,0.8)",
                      }}
                    >
                      {isDone
                        ? "Fields ready to auto-fill!"
                        : stage === "analyzing"
                        ? "AI is analyzing your resume..."
                        : "Uploading resume..."}
                    </span>
                  </div>
                  <span className="text-[11px] tabular-nums text-gray-600">
                    {progress}%
                  </span>
                </div>

                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: isDone
                        ? "linear-gradient(90deg, rgba(16,185,129,0.6), rgba(52,211,153,0.8))"
                        : stage === "analyzing"
                        ? "linear-gradient(90deg, rgba(139,92,246,0.5), rgba(167,139,250,0.85), rgba(16,185,129,0.5))"
                        : "linear-gradient(90deg, rgba(59,130,246,0.5), rgba(96,165,250,0.85))",
                    }}
                  />
                </div>

                {isProcessing && (
                  <motion.div
                    animate={{ x: ["-100%", "400%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 }}
                    className="absolute top-0 left-0 h-full w-1/4 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                    }}
                  />
                )}
              </div>

              <AnimatePresence>
                {stage === "analyzing" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {["Name", "Email", "Skills", "Experience", "Education"].map(
                      (field, i) => (
                        <motion.span
                          key={field}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.15 }}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-medium"
                          style={{
                            background: "rgba(139,92,246,0.1)",
                            border: "1px solid rgba(139,92,246,0.18)",
                            color: "rgba(167,139,250,0.75)",
                          }}
                        >
                          {field}
                        </motion.span>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isDone && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {["Name", "Email", "Skills", "Experience", "Education"].map(
                      (field, i) => (
                        <motion.span
                          key={field}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium"
                          style={{
                            background: "rgba(16,185,129,0.08)",
                            border: "1px solid rgba(16,185,129,0.18)",
                            color: "rgba(52,211,153,0.8)",
                          }}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {field}
                        </motion.span>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="text-[11px] text-gray-600 ml-1">
        Upload to auto fill the required information in seconds, or fill it manually below.
      </p>
    </motion.div>
  );
}
