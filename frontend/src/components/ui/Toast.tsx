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

  useEffect(() => {
    const handleQuotaExceeded = () => {
      addToast({
        type: "error",
        title: "Quota limit reached",
        description: "You have reached your limit. Upgrade to continue.",
      });
    };

    window.addEventListener("arcaive-quota-exceeded", handleQuotaExceeded);
    return () => window.removeEventListener("arcaive-quota-exceeded", handleQuotaExceeded);
  }, [addToast]);

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
  success: "rgba(16,185,129,0.08)",
  error: "rgba(239,68,68,0.08)",
  warning: "rgba(245,158,11,0.08)",
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
      className="pointer-events-auto relative w-[360px] overflow-hidden rounded-xl border border-white/10 backdrop-blur-xl shadow-2xl"
      style={{ background: bgMap[toast.type] }}
    >
      <div className="flex items-start gap-3 px-4 pt-3.5 pb-4">
        <span className="mt-0.5 shrink-0" style={{ color: accent }}>
          {iconMap[toast.type]}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white leading-tight">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-[12px] text-gray-400 leading-snug">
              {toast.description}
            </p>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="shrink-0 mt-0.5 text-gray-500 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      <div className="h-[2px] w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
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
