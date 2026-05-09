"use client";

import { useTranscriptions, useAgent, useSessionContext } from "@livekit/components-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export default function TranscriptionStream() {
  const { microphoneTrack: agentTrack } = useAgent();
  const { local: { microphoneTrack: userTrack } } = useSessionContext();

  const segments = useTranscriptions();

  // Get the latest active segment overall
  const activeTranscription = useMemo(() => {
    if (!segments || segments.length === 0) return null;
    const latest = segments[segments.length - 1] as any;
    return {
      text: latest.text,
      id: latest.id || Math.random().toString(),
      isUser: latest.participant?.isLocal ?? false
    };
  }, [segments]);

  return (
    <div className="w-full max-w-2xl px-6 min-h-[6rem] flex items-center justify-center text-center">
      <AnimatePresence mode="wait">
        {activeTranscription && activeTranscription.text && (
          <motion.p
            key={activeTranscription.id}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
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
