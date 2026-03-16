import { AgentAudioVisualizerBar } from "@/components/agents-ui/agent-audio-visualizer-bar";
import { AgentChatTranscript } from "@/components/agents-ui/agent-chat-transcript";
import { useAgent, useSessionMessages } from "@livekit/components-react";
import { Mic, User, MessageSquare, ListTodo, Sparkles } from "lucide-react";

export default function AgentControls() {
  const { state, microphoneTrack } = useAgent();
  const { messages } = useSessionMessages();

  return (
    <>
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="flex-1 relative bg-[var(--d-surface)] rounded-[2rem] border border-[var(--d-border)] overflow-hidden shadow-2xl group transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-10">
              <div className="w-28 h-28 rounded-[2.5rem] bg-linear-to-br from-[var(--d-glow-blue)] to-[var(--d-glow-purple)] flex items-center justify-center shadow-2xl border border-[var(--d-border-hover)]">
                <span className="text-4xl font-bold text-[var(--d-text-primary)]">A</span>
              </div>
              
              <div className="h-16 flex items-center">
                <AgentAudioVisualizerBar
                  size="lg"
                  color="var(--d-text-secondary)"
                  barCount={15}
                  state={state}
                  audioTrack={microphoneTrack}
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2 bg-[var(--d-surface-active)] backdrop-blur-2xl rounded-2xl border border-[var(--d-border-hover)] text-xs font-semibold shadow-lg">
            <div className={`w-2 h-2 rounded-full ${state === 'speaking' ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-[var(--d-text-ghost)]'}`} />
            <span className="tracking-wide">Arcaive AI Interviewer</span>
          </div>
        </div>

        <div className="h-44 flex items-center gap-6 overflow-x-auto no-scrollbar py-2 shrink-0">
          <div className="aspect-video h-full bg-[var(--d-surface)] rounded-3xl border border-[var(--d-border)] overflow-hidden relative shadow-lg group hover:border-[var(--d-border-hover)] transition-all">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--d-surface-active)] flex items-center justify-center border border-[var(--d-border)]">
                <User className="w-6 h-6 text-[var(--d-text-secondary)]" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-[var(--d-surface-active)] backdrop-blur-md rounded-xl border border-[var(--d-border)] text-[10px] font-bold">
              <span>Candidate (You)</span>
            </div>
          </div>
          
          <div className="aspect-video h-[85%] bg-[var(--d-surface)]/40 rounded-3xl border border-[var(--d-border)] border-dashed flex items-center justify-center group hover:bg-[var(--d-surface)] transition-all cursor-pointer">
             <span className="text-[10px] font-bold text-[var(--d-text-muted)] group-hover:text-[var(--d-text-secondary)]">Wait for Peer</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
        <div className="bg-[var(--d-surface)] rounded-3xl border border-[var(--d-border)] p-6 shadow-xl flex flex-col h-[40%]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest">Real-time Summary</h3>
            </div>
          </div>
          <div className="flex-1 text-xs leading-relaxed text-[var(--d-text-secondary)] overflow-y-auto no-scrollbar">
            The interview is in progress. The AI is currently assessing your communication style and technical depth in frontend frameworks.
          </div>
        </div>

        <div className="bg-[var(--d-surface)] rounded-3xl border border-[var(--d-border)] flex flex-col h-[60%] shadow-xl overflow-hidden transition-all duration-300">
          <div className="p-6 border-b border-[var(--d-border)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest">Chat Transcript</h3>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            <AgentChatTranscript agentState={state} messages={messages} />
          </div>
        </div>
      </div>
    </>
  );
}



