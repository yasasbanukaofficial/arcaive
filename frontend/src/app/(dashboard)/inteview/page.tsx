"use client";

import { useState } from "react";
import useLiveKitToken from "@/features/interview/hooks/useLiveKitToken";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import AgentPanel from "@/features/interview/components/AgentPanel";
import { ArrowRight, Mic, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const ROOM_NAME = `room-${Date.now()}`;
const PARTICIPANT_NAME = `user-${Date.now()}`;

export default function InterviewPage() {
  const [step, setStep] = useState<"welcome" | "interview" | "results">("welcome");
  const router = useRouter();
  const { connection, loading, error } = useLiveKitToken(
    ROOM_NAME,
    PARTICIPANT_NAME,
  );

  // Dashboard-scoped container: fills main content area (below top bar, right of sidebar)
  const overlayClass = "relative z-10 h-full min-h-full w-full bg-[#0a0b0d] text-[#e5e5e0] flex flex-col font-sans selection:bg-[#2a2b2e] selection:text-white";
  const serifClass = "font-serif tracking-tight";

  if (loading) return (
    <div className={overlayClass}>
      <div className="m-auto flex flex-col items-center gap-6">
        <div className="w-px h-12 bg-[#2a2b2e]" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#555]">Connecting</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={overlayClass}>
      <div className="m-auto text-center max-w-md">
         <p className="text-red-400 font-mono text-xs mb-4">CONNECTION_ERROR</p>
         <p className="text-[#555]">{error}</p>
      </div>
    </div>
  );

  if (step === "welcome") {
    return (
      <div className={overlayClass}>
        <div className="m-auto max-w-xl w-full px-8 flex flex-col gap-12">
          <div className="space-y-6">
            <span className="text-[10px] font-mono text-[#555] uppercase tracking-widest">Arcaive Terminal // Session 01</span>
            <h1 className={`${serifClass} text-5xl md:text-6xl font-light text-[#f7f5f2] leading-[1.1]`}>
              Technical Interview<br />Simulation
            </h1>
            <p className="text-[#888] text-lg font-light max-w-md leading-relaxed">
              You are entering a private session. Audio data is processed in real-time and explicitly not retained.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[#2a2b2e] border border-[#2a2b2e]">
             <div className="bg-[#0a0b0d] p-6 group transition-colors hover:bg-[#111318]">
               <ShieldCheck className="w-5 h-5 text-[#444] mb-4 group-hover:text-[#e5e5e0] transition-colors stroke-1" />
               <h3 className="text-sm font-medium text-[#e5e5e0] mb-2">Private Environment</h3>
               <p className="text-xs text-[#555] leading-relaxed">No recording. No storage. Ephemeral execution.</p>
             </div>
             <div className="bg-[#0a0b0d] p-6 group transition-colors hover:bg-[#111318]">
               <Mic className="w-5 h-5 text-[#444] mb-4 group-hover:text-[#e5e5e0] transition-colors stroke-1" />
               <h3 className="text-sm font-medium text-[#e5e5e0] mb-2">Audio Input</h3>
               <p className="text-xs text-[#555] leading-relaxed">Browser permission required for voice interaction.</p>
             </div>
          </div>

          <button
            onClick={() => setStep("interview")}
            className="group flex items-center justify-between w-full p-6 border border-[#2a2b2e] hover:border-[#444] hover:bg-[#111318] transition-all duration-300"
          >
            <span className="text-sm tracking-widest uppercase text-[#e5e5e0]">Initialize Session</span>
            <ArrowRight className="w-4 h-4 text-[#444] group-hover:text-[#e5e5e0] transition-all transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  if (step === "results") {
    return (
      <div className={overlayClass}>
        <div className="m-auto max-w-2xl w-full px-8">
           <div className="border-l border-[#2a2b2e] pl-8 py-2 mb-12">
             <h2 className={`${serifClass} text-4xl text-[#f7f5f2] mb-2`}>Session Concluded</h2>
             <p className="font-mono text-xs text-[#555] uppercase tracking-widest">Report Generated Successfully</p>
           </div>

           <div className="grid grid-cols-3 gap-12 mb-16 border-t border-[#2a2b2e] pt-8">
             <div>
               <span className="block font-mono text-[10px] text-[#555] uppercase tracking-widest mb-3">Overall Score</span>
               <span className={`${serifClass} text-5xl text-[#e5e5e0]`}>84</span>
             </div>
             <div>
               <span className="block font-mono text-[10px] text-[#555] uppercase tracking-widest mb-3">Communication</span>
               <span className="text-xl text-[#ccc] font-light">Excellent</span>
             </div>
             <div>
               <span className="block font-mono text-[10px] text-[#555] uppercase tracking-widest mb-3">Technical</span>
               <span className="text-xl text-[#ccc] font-light">Proficient</span>
             </div>
           </div>

           <div className="space-y-8 mb-16">
             <h3 className="font-mono text-[10px] text-[#555] uppercase tracking-widest">Analysis</h3>
             <p className="text-[#888] font-light text-lg leading-relaxed">
               Candidate demonstrated strong command of React internals. State management explanation was concise and accurate. Recommended focus area: Web Vitals optimization strategies.
             </p>
           </div>

           <button
              onClick={() => router.push("/overview")}
              className="text-xs font-mono uppercase tracking-widest text-[#555] hover:text-[#e5e5e0] transition-colors flex items-center gap-2"
           >
             ← Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className={overlayClass}>
      <LiveKitRoom
        serverUrl={connection!.url}
        token={connection!.token}
        connect={true}
        video={false}
        audio={true}
        onDisconnected={() => setStep("results")}
        className="w-full h-full"
      >
        <AgentPanel
          serverUrl={connection!.url}
          participantToken={connection!.token}
        />
      </LiveKitRoom>
    </div>
  );
}


