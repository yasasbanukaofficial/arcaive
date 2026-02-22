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
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          className="block text-[13px] font-medium ml-0.5"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          {label}
        </label>
      )}
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        animate={{
          scale: isDragging ? 1.01 : 1,
          borderColor: isDragging
            ? "rgba(59, 130, 246, 0.4)"
            : error
              ? "rgba(239, 68, 68, 0.4)"
              : "rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.15 }}
        className={`
          relative rounded-xl py-8 px-6 text-center cursor-pointer
          transition-all duration-200 group
          ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        `}
        style={{
          backgroundColor: isDragging
            ? "rgba(59, 130, 246, 0.04)"
            : "rgba(255, 255, 255, 0.03)",
          border: error
            ? "1.5px dashed rgba(239, 68, 68, 0.4)"
            : isDragging
              ? "1.5px dashed rgba(59, 130, 246, 0.4)"
              : "1.5px dashed rgba(255, 255, 255, 0.1)",
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

        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{
              y: isDragging ? -4 : 0,
              scale: isDragging ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200"
            style={{
              backgroundColor: isDragging
                ? "rgba(59, 130, 246, 0.1)"
                : "var(--d-surface-active)",
              border: `1px solid ${isDragging ? "rgba(59, 130, 246, 0.2)" : "var(--d-border)"}`,
            }}
          >
            <Upload
              className="w-4.5 h-4.5 transition-colors duration-200"
              style={{
                color: isDragging
                  ? "rgba(59, 130, 246, 0.7)"
                  : "var(--d-text-muted)",
              }}
            />
          </motion.div>

          <div>
            <p
              className="text-[13px] font-medium mb-1"
              style={{
                color: isDragging
                  ? "rgba(59, 130, 246, 0.8)"
                  : "var(--d-text-secondary)",
              }}
            >
              {isDragging
                ? "Drop your files here"
                : "Drag & drop files here, or click to browse"}
            </p>
            <p
              className="text-[12px]"
              style={{ color: "var(--d-text-muted)" }}
            >
              {acceptHint} up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      </motion.div>
      {status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            backgroundColor:
              status === "uploading"
                ? "rgba(59, 130, 246, 0.05)"
                : status === "success"
                  ? "rgba(34, 197, 94, 0.05)"
                  : "rgba(239, 68, 68, 0.05)",
            border: `1px solid ${
              status === "uploading"
                ? "rgba(59, 130, 246, 0.15)"
                : status === "success"
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(239, 68, 68, 0.15)"
            }`,
          }}
        >
          {status === "uploading" && (
            <svg
              className="animate-spin w-4 h-4 shrink-0"
              style={{ color: "rgba(59, 130, 246, 0.6)" }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {status === "success" && (
            <CheckCircle
              className="w-4 h-4 shrink-0"
              style={{ color: "rgba(34, 197, 94, 0.7)" }}
            />
          )}
          {status === "error" && (
            <AlertCircle
              className="w-4 h-4 shrink-0"
              style={{ color: "rgba(239, 68, 68, 0.7)" }}
            />
          )}

          <div className="flex-1 min-w-0">
            <p
              className="text-[12px] font-medium"
              style={{
                color:
                  status === "uploading"
                    ? "rgba(59, 130, 246, 0.8)"
                    : status === "success"
                      ? "rgba(34, 197, 94, 0.8)"
                      : "rgba(239, 68, 68, 0.8)",
              }}
            >
              {statusMessage ||
                (status === "uploading"
                  ? "Processing..."
                  : status === "success"
                    ? "Upload complete"
                    : "Upload failed")}
            </p>
            {status === "uploading" && typeof progress === "number" && (
              <div
                className="mt-1.5 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.7))",
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
      <AnimatePresence mode="popLayout">
        {files.map((f, i) => (
          <motion.div
            key={`${f.name}-${i}`}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -16, height: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--d-surface-active)",
                border: "1px solid var(--d-border)",
              }}
            >
              {getFileIcon(f.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] font-medium truncate"
                style={{ color: "var(--d-text-secondary)" }}
              >
                {f.name}
              </p>
              <p
                className="text-[11px]"
                style={{ color: "var(--d-text-muted)" }}
              >
                {formatFileSize(f.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(i);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150"
              style={{
                color: "var(--d-text-muted)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.color = "rgba(239, 68, 68, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--d-text-muted)";
              }}
              aria-label={`Remove ${f.name}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {error && (
        <p className="text-[12px] ml-0.5 text-red-400/80">{error}</p>
      )}
      {hint && !error && (
        <p
          className="text-[12px] ml-0.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export type { UploadedFile, FileUploadStatus };
