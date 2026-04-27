"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";

type FileUploadStatus = "idle" | "uploading" | "success" | "error";

type UploadedFile = {
  name: string;
  size: number;
  type: string;
  file: File;
};

type FileUploadProps = {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  status?: FileUploadStatus;
  statusMessage?: string;
  progress?: number;
  hint?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

function getFileIcon(type: string): React.ReactNode {
  const color =
    type === "application/pdf"
      ? "rgba(239, 68, 68, 0.6)"
      : type.includes("word") || type.includes("docx")
        ? "rgba(59, 130, 246, 0.6)"
        : "var(--d-text-muted)";

  return <File className="w-4 h-4" style={{ color }} />;
}

export default function FileUpload({
  label,
  accept = ".pdf,.doc,.docx",
  maxSizeMB = 10,
  multiple = false,
  files,
  onFilesChange,
  status = "idle",
  statusMessage,
  progress,
  hint,
  error,
  disabled = false,
  className = "",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return;

      const incoming = Array.from(fileList);
      const valid: UploadedFile[] = [];

      for (const f of incoming) {
        if (f.size > maxSizeBytes) continue;
        valid.push({
          name: f.name,
          size: f.size,
          type: f.type,
          file: f,
        });
      }

      if (multiple) {
        onFilesChange([...files, ...valid]);
      } else {
        onFilesChange(valid.slice(0, 1));
      }
    },
    [disabled, files, maxSizeBytes, multiple, onFilesChange],
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragCounter.current += 1;
      if (dragCounter.current === 1) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      if (!disabled) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, handleFiles],
  );

  const removeFile = useCallback(
    (index: number) => {
      const updated = files.filter((_, i) => i !== index);
      onFilesChange(updated);
    },
    [files, onFilesChange],
  );

  const acceptHint = accept
    .split(",")
    .map((ext) => ext.trim().replace(".", "").toUpperCase())
    .join(", ");

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label
          className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]"
        >
          {label}
        </label>
      )}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative py-12 px-6 text-center cursor-pointer  duration-200 border
          ${disabled ? "opacity-40 cursor-not-allowed" : ""}
          ${isDragging ? "bg-[var(--glass-border)] border-[var(--text-primary)]" : "bg-[var(--glass-bg)] border-[var(--glass-border)]"}
          ${error ? "border-[#D83B2A]" : ""}
        `}
        style={{
          borderStyle: "dashed",
          borderRadius: "var(--radius)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-primary)] font-bold">
            {isDragging ? "DROP DOCUMENT" : "UPLOAD YOUR CV"}
          </div>
          <p className="font-sans text-[12px] text-[var(--text-secondary)]">
            {acceptHint} UP TO {maxSizeMB}MB
          </p>
        </div>
      </div>

      {status !== "idle" && (
        <div
          className="px-4 py-3 flex flex-col gap-2 border border-[var(--glass-border)]"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)]">
              {statusMessage || (status === "uploading" ? "ANALYZING" : status === "success" ? "READY" : "ERROR")}
            </span>
            {status === "uploading" && <span className="font-mono text-[10px]">{progress}%</span>}
          </div>
          
          {status === "uploading" && typeof progress === "number" && (
            <div className="h-[2px] w-full bg-[var(--glass-border)]">
              <div 
                className="h-full bg-[var(--text-primary)] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {files.map((f, i) => (
          <motion.div
            key={`${f.name}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between border border-[var(--text-primary)] p-4"
          >
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[13px] font-bold truncate uppercase">{f.name}</span>
              <span className="font-mono text-[10px] text-[var(--text-secondary)]">{formatFileSize(f.size)}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(i);
              }}
              className="px-3 py-1 bg-black text-white hover:bg-[#D83B2A] transition-colors font-mono text-[10px] font-bold uppercase tracking-widest rounded-[var(--radius)]"
            >
              REMOVE
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {error && (
        <p className="font-mono text-[11px] text-[#D83B2A] uppercase tracking-widest">! {error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">
          {hint}
        </p>
      )}
    </div>
  );
}

export type { UploadedFile, FileUploadStatus };
