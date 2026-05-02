"use client";

import { useTranscriptions, useAgent, useSessionContext } from "@livekit/components-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export default function TranscriptionStream() {
  const { microphoneTrack: agentTrack } = useAgent();
  const { local: { microphoneTrack: userTrack } } = useSessionContext();

  // useTranscriptions returns an array of TranscriptionSegment
  const agentSegments = useTranscriptions(agentTrack);
  const userSegments = useTranscriptions(userTrack);

  // Combine segments from both and get the latest active one
  const activeTranscription = useMemo(() => {
    const agentSegment = agentSegments[agentSegments.length - 1];
    const userSegment = userSegments[userSegments.length - 1];

    if (!agentSegment && !userSegment) return null;
    
    // Simple logic: show whichever was updated most recently
    if (!agentSegment) return { text: userSegment.text, id: userSegment.id, isUser: true };
    if (!userSegment) return { text: agentSegment.text, id: agentSegment.id, isUser: false };

    // Compare timestamps to find the most recent interaction
    return (agentSegment.firstReceivedTime ?? 0) > (userSegment.firstReceivedTime ?? 0)
      ? { text: agentSegment.text, id: agentSegment.id, isUser: false }
      : { text: userSegment.text, id: userSegment.id, isUser: true };
  }, [agentSegments, userSegments]);

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
