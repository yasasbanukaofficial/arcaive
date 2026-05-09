"use client";

import useLiveKitToken from "@/features/interview/hooks/useLiveKitToken";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import AgentPanel from "@/features/interview/components/AgentPanel";
import InterviewSetupModal from "@/features/interview/components/InterviewSetupModal";
import InterviewLoadingScreen from "@/features/interview/components/InterviewLoadingScreen";
import { jobAPI } from "@/features/jobs/api/jobAPI";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JobListing } from "@/@types/jobs";


import { 
  DashboardPageWrapper,
  DashboardHeader,
  DashboardGrid,
  DashboardCard,
} from "@/features/dashboard/components/DashboardLayoutComponents";

export default function InterviewPage() {
  const params = useSearchParams();
  const jobId = params.get("jobId");
  const [job, setJob] = useState<JobListing | null>(null);
  const [jobResolved, setJobResolved] = useState(false);
  const [showSetup, setShowSetup] = useState(true);

  useEffect(() => {
    if (jobId) {
      const jobData = jobAPI.getCachedJob(jobId);
      setJob(jobData ?? null);
    }
    setJobResolved(true)
  }, [jobId]);

  const { connection, duration, loading, error } = useLiveKitToken(
    (jobResolved && !showSetup) ? (job ?? null) : undefined
  );

  return (
    <div className="w-full flex flex-col gap-8 pb-20 px-4 md:px-8 h-[calc(100vh-140px)]">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 shrink-0">
        <div className="space-y-1">
          <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none capitalize">
            Interview
          </h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">Real-time neural feedback and vocal interaction</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
           <span className="text-[13px] font-bold tracking-tight text-[var(--text-primary)] uppercase">Secure Live Session</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[40px] shadow-2xl overflow-hidden group">
          <InterviewSetupModal 
            isOpen={showSetup} 
            onStart={() => setShowSetup(false)} 
          />
          
          {!showSetup && (
            <div className="flex-1 flex flex-col min-h-0 relative h-full">
              {loading && (
                <InterviewLoadingScreen message="Establishing secure connection..." />
              )}
              
              {error && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8">
                     <AlertCircle size={32} className="text-red-500/60" />
                  </div>
                  <h3 className="text-[24px] font-bold text-[var(--text-primary)] mb-3 tracking-tight">Signal Interrupted</h3>
                  <p className="text-[15px] text-[var(--text-secondary)] max-w-md mb-10 leading-relaxed font-medium">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="h-14 px-10 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-full font-bold text-[13px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    Reinitialize Connection
                  </button>
                </div>
              )}

              {!loading && !error && connection && duration &&(
                <LiveKitRoom
                  serverUrl={connection.url}
                  token={connection.token}
                  connect={true}
                  video={false}
                  audio={false}
                  onDisconnected={() => {}}
                  className="flex-1 flex flex-col min-h-0 h-full"
                >
                  <RoomAudioRenderer />
                  <AgentPanel duration={duration}/>
                </LiveKitRoom>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
