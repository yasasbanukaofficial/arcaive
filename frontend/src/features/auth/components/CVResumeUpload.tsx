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
  password?: string | null;
  jobRole?: string | null;
  experience?: string | null;
  country?: string | null;
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

  const completeFlow = useCallback(
    (extracted?: ExtractedMember) => {
      clearProgress();
      setProgress(100);
      setTimeout(() => {
        setStage("done");
        if (extracted && onExtracted) onExtracted(extracted);
      }, 300);
    },
    [onExtracted],
  );

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

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const f = fileList[0];
      const maxBytes = 10 * 1024 * 1024;
      if (f.size > maxBytes) return;

      const acceptedTypes = [
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const isAccepted =
        acceptedTypes.includes(f.type) || f.name.match(/\.(pdf|doc|docx)$/i);

      if (!isAccepted) {
        addToast({
          type: "error",
          title: "Unsupported Format",
          description: "Please upload a PDF or Word document.",
        });
        return;
      }

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
          description:
            "We couldn't extract info from this file. Please ensure it's a valid CV.",
        });
      }
    },
    [runUploadFlow, completeFlow],
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
          RESUME_DOC
        </span>

        <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black border border-black px-2 py-0.5">
          [ AI_POWERED ]
        </div>
      </div>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isProcessing && inputRef.current?.click()}
        className={`relative px-8 py-10 text-center border transition-colors ${
          isDragging ? "bg-[#F5F4EF] border-black" : isDone ? "bg-white border-black" : "bg-white border-[#E8E6DE] border-dashed"
        } ${isProcessing ? "cursor-default" : "cursor-pointer"}`}
        style={{ borderRadius: 0 }}
      >
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
              className="flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 border border-black flex items-center justify-center bg-[#F5F4EF]">
                <UploadCloud className="w-5 h-5 text-black" />
              </div>

              <div className="space-y-1">
                <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-black">
                  {isDragging ? "DROP_FILE_NOW" : "UPLOAD_RESUME_DOC"}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#888880]">
                  PDF, DOC, DOCX · MAX 10MB
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-tight text-[#888880]">
                <span>→ AUTO_FILL_NAME_ROLE_EXPERIENCE</span>
              </div>
            </motion.div>
          )}

          {(isProcessing || isDone) && file && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 text-left p-4 border border-[#E8E6DE] bg-[#F5F4EF]">
                <div className="w-10 h-10 border border-black flex items-center justify-center bg-white shrink-0">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] font-bold text-black uppercase truncate">
                    {file.name}
                  </p>
                  <p className="font-mono text-[10px] text-[#888880] uppercase">
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
                    className="font-mono text-[11px] text-[#888880] hover:text-black transition-colors"
                  >
                    [ REMOVE ]
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-black">
                      {isDone ? "✓ READY_TO_FILL" : stage === "analyzing" ? "→ ANALYZING_DOC" : "→ UPLOADING_DOC"}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-black">
                    {progress}%
                  </span>
                </div>

                <div className="h-[2px] bg-[#E8E6DE]">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                    className="h-full bg-black"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Name", "Email", "Job Role", "Experience", "Country"].map((field) => (
                  <span
                    key={field}
                    className={`px-2 py-1 font-mono text-[10px] uppercase tracking-widest border  ${
                      isDone ? "border-black bg-[#F5F4EF] text-black" : "border-[#E8E6DE] text-[#888880]"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    {isDone && "✓ "}{field}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-widest text-[#888880]">
        UPLOAD_TO_AUTO_FILL_IN_SECONDS_OR_MANUAL_ENTRY_BELOW
      </p>
    </motion.div>
  );
}
