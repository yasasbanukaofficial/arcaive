import { AgentAudioVisualizerBar } from "@/components/agents-ui/agent-audio-visualizer-bar";
import { AgentChatTranscript } from "@/components/agents-ui/agent-chat-transcript";
import { useAgent, useSessionMessages } from "@livekit/components-react";
import { Mic, User, MessageSquare, ListTodo, Sparkles } from "lucide-react";

export default function AgentControls() {
  const { state, microphoneTrack } = useAgent();
  const { messages } = useSessionMessages();

  return (
    <>
      <div className="flex-1 flex flex-col gap-6 min-w-0 h-full">
        <div className="flex-1 relative bg-white border border-[#E8E6DE] overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-10">
              <div className="w-24 h-24 bg-white flex items-center justify-center border border-black">
                <span className="font-sans text-4xl font-bold text-black uppercase">A</span>
              </div>
              
              <div className="h-16 flex items-center">
                <AgentAudioVisualizerBar
                  size="lg"
                  color="#000000"
                  barCount={15}
                  state={state}
                  audioTrack={microphoneTrack}
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2 bg-[#F5F4EF] border border-black">
            <div className={`w-2 h-2 ${state === 'speaking' ? 'bg-black' : 'bg-[#888880]'}`} style={{ borderRadius: 0 }} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black">Arcaive AI Interviewer</span>
          </div>
        </div>

        <div className="h-44 flex items-center gap-6 overflow-x-auto no-scrollbar py-2 shrink-0">
          <div className="aspect-video h-full bg-white border border-[#E8E6DE] overflow-hidden relative group hover:border-black transition-colors">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-[#F5F4EF] flex items-center justify-center border border-[#E8E6DE]">
                <User className="w-5 h-5 text-black" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white border border-[#E8E6DE]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#888880]">Candidate (You)</span>
            </div>
          </div>
          
          <div className="aspect-video h-[85%] bg-white border border-[#E8E6DE] border-dashed flex items-center justify-center group hover:bg-[#F5F4EF] transition-colors cursor-pointer">
             <span className="font-mono text-[10px] font-bold text-[#888880] uppercase tracking-widest">Wait for Peer</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0 lg:h-full min-h-0">
        <div className="bg-white border border-[#E8E6DE] p-8 flex flex-col flex-[4] min-h-0">
          <div className="flex items-center justify-between mb-6 border-b border-[#E8E6DE] pb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-black">Real-time Summary</h3>
            </div>
          </div>
          <div className="flex-1 font-sans text-[13px] leading-relaxed text-[#888880] overflow-y-auto no-scrollbar uppercase tracking-tight">
            The interview is in progress. The AI is currently assessing your communication style and technical depth in frontend frameworks.
          </div>
        </div>

        <div className="relative bg-white border border-[#E8E6DE] flex flex-col flex-[6] overflow-hidden transition-colors group/chat min-h-0">
          <div className="p-6 border-b border-[#E8E6DE] flex items-center justify-between shrink-0 bg-[#F5F4EF] relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white border border-[#E8E6DE]">
                <MessageSquare className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-black">Chat Transcript</h3>
                <p className="font-mono text-[10px] text-[#888880] uppercase mt-0.5">Real-time interview logs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 border border-black bg-white">
              <span className="font-mono text-[10px] font-bold text-black uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative z-10 min-h-0">
            <AgentChatTranscript agentState={state} messages={messages} className="h-full custom-scrollbar" />
          </div>
        </div>
      </div>
    </>
  );
}



