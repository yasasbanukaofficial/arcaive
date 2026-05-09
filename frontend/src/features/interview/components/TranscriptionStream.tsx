"use client";

import { useTranscriptions } from "@livekit/components-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export default function TranscriptionStream() {
  const segments = useTranscriptions();

  // Get the latest active segment overall
  const activeTranscription = useMemo(() => {
    if (!segments || segments.length === 0) return null;
    const latest = segments[segments.length - 1];
    return {
      text: latest.text,
      id: latest.id || `transcription-${segments.length}`,
      isUser: latest.participant?.isLocal ?? false
    };
  }, [segments]);

  return (
    <div className="w-full max-w-2xl px-6 min-h-[6rem] flex items-center justify-center text-center">
      <AnimatePresence mode="wait">
        {activeTranscription && activeTranscription.text && (
          <motion.p
            key={activeTranscription.id}
            className={`text-xl sm:text-2xl font-medium tracking-tight leading-relaxed ${
                activeTranscription.isUser ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"
            }`}
          >
            {activeTranscription.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
