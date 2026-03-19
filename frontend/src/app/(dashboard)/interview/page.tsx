"use client";

import useLiveKitToken from "@/features/interview/hooks/useLiveKitToken";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import AgentPanel from "@/features/interview/components/AgentPanel";
import { jobAPI } from "@/features/jobs/api/jobAPI";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JobListing } from "@/@types/jobs";

export default function InterviewPage() {
  const params = useSearchParams();
  const jobId = params.get("jobId");
  const [job, setJob] = useState<JobListing | null>();
  const [jobResolved, setJobResolved] = useState(false);

  useEffect(() => {
    if (jobId) {
      const jobData = jobAPI.getCachedJob(jobId);
      setJob(jobData ?? null);
      setJobResolved(true)
    } else { setJobResolved(true) }
  }, [jobId]);

  const { connection, loading, error } = useLiveKitToken(jobResolved ? job : undefined);

  if (loading) return <p>Connecting...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-[calc(100vh-76px)] flex flex-col overflow-hidden">
      <LiveKitRoom
        serverUrl={connection!.url}
        token={connection!.token}
        connect={true}
        video={false}
        audio={true}
        onDisconnected={() => console.log("Disconnected")}
      >
        <RoomAudioRenderer />
        <AgentPanel />
      </LiveKitRoom>
    </div>
  );
}
