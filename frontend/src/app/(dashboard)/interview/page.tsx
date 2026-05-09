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
    <DashboardPageWrapper>
      <DashboardHeader title="Interview Session" />
      <DashboardGrid>
        <DashboardCard className="lg:col-span-12 min-h-[600px] flex flex-col relative overflow-hidden" title="Live Agent">
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
                <div className="flex-1 flex flex-col items-center justify-center p-6 h-full">
                  <div className="bg-red-500/10 border border-red-500/20 p-6 max-w-md text-center rounded-[var(--radius)]">
                    <p className="text-red-500 font-semibold mb-2">Connection Error</p>
                    <p className="text-[14px] opacity-80 mb-6">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 bg-red-500 text-white rounded-full text-[13px] font-bold transition-all hover:bg-red-600"
                    >
                      Try Again
                    </button>
                  </div>
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
        </DashboardCard>
      </DashboardGrid>
    </DashboardPageWrapper>
  );
}
