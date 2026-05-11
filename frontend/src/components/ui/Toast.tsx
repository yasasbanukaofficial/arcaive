"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

type ToastInput = Omit<Toast, "id">;

interface ToastContextValue {
  addToast: (toast: ToastInput) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((input: ToastInput) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...input, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
};

const accentMap: Record<ToastType, string> = {
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
};

const bgMap: Record<ToastType, string> = {
  success: "rgba(16,185,129,0.05)",
  error: "rgba(239,68,68,0.05)",
  warning: "rgba(245,158,11,0.05)",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const duration = toast.duration ?? 4000;
  const accent = accentMap[toast.type];

  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      className="pointer-events-auto relative w-[360px] overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-2xl"
      style={{ 
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}
    >
      <div 
        className="absolute inset-0 opacity-[0.4]" 
        style={{ background: bgMap[toast.type] }} 
      />
      <div className="flex items-start gap-3 px-4 pt-4 pb-4 relative z-10">
        <span className="mt-0.5 shrink-0" style={{ color: accent }}>
          {iconMap[toast.type]}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1.5 text-[12px] text-[var(--text-secondary)] font-medium leading-snug">
              {toast.description}
            </p>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="shrink-0 mt-0.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      <div className="h-[2px] w-full relative z-10" style={{ background: "var(--border-light)" }}>
        <motion.div
          className="h-full origin-left"
          style={{ background: accent }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
