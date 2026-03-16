import { AgentAudioVisualizerBar } from "@/components/agents-ui/agent-audio-visualizer-bar";
import { AgentChatTranscript } from "@/components/agents-ui/agent-chat-transcript";
import { useAgent, useSessionMessages, useLocalParticipant } from "@livekit/components-react";
import { Mic, User } from "lucide-react";

export default function AgentControls() {
  const { state, microphoneTrack } = useAgent();
  const { messages } = useSessionMessages();
  const { localParticipant } = useLocalParticipant();

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex-1 relative bg-[#1c1c1c] rounded-xl overflow-hidden shadow-sm group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-[#3c4043] flex items-center justify-center shadow-lg">
                <span className="text-3xl font-light text-white/90">A</span>
              </div>
              
              <div className="h-12 flex items-center">
                <AgentAudioVisualizerBar
                  size="lg"
                  color="#8ab4f8"
                  barCount={9}
                  state={state}
                  audioTrack={microphoneTrack}
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg text-xs font-medium text-white/90">
            {state === 'speaking' && <Mic className="w-3.5 h-3.5 text-[#8ab4f8]" />}
            <span>Arcaive AI Interviewer</span>
          </div>
        </div>

        <div className="h-40 flex items-center justify-start gap-4">
          <div className="aspect-video h-full bg-[#1c1c1c] rounded-xl overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#3c4043] flex items-center justify-center">
                <User className="w-6 h-6 text-white/70" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] font-medium text-white/90">
              <span>You (Candidate)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[360px] hidden xl:flex flex-col bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden backdrop-blur-3xl">
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <h2 className="text-sm font-medium">In-call Messages</h2>
          <div className="h-2 w-2 rounded-full bg-[#8ab4f8] animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          <AgentChatTranscript agentState={state} messages={messages} />
        </div>
      </div>
    </>
  );
}


