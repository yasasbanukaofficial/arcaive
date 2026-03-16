import { AgentAudioVisualizerBar } from "@/components/agents-ui/agent-audio-visualizer-bar";
import { useAgent, useSessionMessages } from "@livekit/components-react";
import { ArrowDown, Copy, Mic, MicOff, Moon, PhoneOff, Sun } from "lucide-react";
import { useMemo, useRef } from "react";

type AgentControlsProps = {
  isMicrophoneEnabled: boolean;
  onMicToggle: () => Promise<void>;
  onEndCall: () => Promise<void>;
  mode: "dark" | "light";
  onModeToggle: () => void;
};

const STATE_LABEL: Record<string, string> = {
  connecting: "CONNECTING",
  initializing: "INITIALIZING",
  listening: "LISTENING",
  thinking: "THINKING",
  speaking: "SPEAKING",
};

export default function AgentControls({
  isMicrophoneEnabled,
  onMicToggle,
  onEndCall,
  mode,
  onModeToggle,
}: AgentControlsProps) {
  const { state, microphoneTrack } = useAgent();
  const { messages } = useSessionMessages();
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  const transcriptCopy = useMemo(
    () =>
      messages
        .map((entry) => `${entry.from?.isLocal ? "Candidate" : "Interviewer"}: ${entry.message}`)
        .join("\n\n"),
    [messages],
  );

  const handleCopyTranscript = async () => {
    if (!transcriptCopy) {
      return;
    }
    await navigator.clipboard.writeText(transcriptCopy);
  };

  const handleScrollBottom = () => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  };

  const stateText = STATE_LABEL[state ?? ""] ?? "ACTIVE";

  return (
    <div className="relative grid h-full min-h-0 w-full grid-cols-1 lg:grid-cols-[3fr_2fr] bg-[var(--iv-bg)] text-[var(--iv-text)]">
      <section className="relative min-h-0 border-r border-[var(--iv-border)]/90 bg-[var(--iv-bg)] p-8 md:p-12">
        <div className="relative h-full w-full border border-[var(--iv-border)] bg-[var(--iv-surface)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <AgentAudioVisualizerBar
              size="lg"
              color="#d9d2c4"
              barCount={21}
              state={state}
              audioTrack={microphoneTrack}
              className="h-36 gap-[6px]"
            />
          </div>

          <p
            className="absolute bottom-6 left-6 text-[11px] uppercase tracking-[0.24em] text-[var(--iv-muted)]"
            style={{ fontVariant: "small-caps", fontFamily: "var(--font-editorial), serif" }}
          >
            Arcaive Interviewer
          </p>
          <p className="absolute bottom-6 right-6 font-mono text-[11px] tracking-[0.18em] text-[var(--iv-accent)]">
            {stateText}
          </p>
        </div>
      </section>

      <section className="relative min-h-0 bg-[var(--iv-bg)] px-8 pb-24 pt-8 md:px-10 md:pt-12">
        <div className="h-px w-full bg-[var(--iv-border)]" aria-hidden="true" />
        <div
          ref={transcriptRef}
          className="relative mt-6 h-[calc(100%-1.75rem)] overflow-y-auto pr-1"
          style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 7%, black 100%)" }}
        >
          <div className="space-y-8 pb-8">
            {messages.map((entry) => {
              const origin = entry.from?.isLocal ? "Candidate" : "Interviewer";
              const timestamp = new Date(entry.timestamp).toLocaleTimeString();

              return (
                <article key={entry.id} className="group border-b border-[var(--iv-border)]/40 pb-6">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] text-[var(--iv-muted)]"
                      style={{ fontVariant: "small-caps" }}
                    >
                      {origin}
                    </p>
                    <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--iv-muted)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      {timestamp}
                    </span>
                  </div>
                  <p
                    className="text-[1.12rem] leading-[1.75] text-[var(--iv-text)]"
                    style={{ fontFamily: "var(--font-editorial), serif" }}
                  >
                    {entry.message}
                  </p>
                </article>
              );
            })}

            {state === "thinking" && (
              <article className="border-b border-[var(--iv-border)]/40 pb-6">
                <p
                  className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--iv-muted)]"
                  style={{ fontVariant: "small-caps" }}
                >
                  Interviewer
                </p>
                <p
                  className="text-[1.05rem] leading-[1.75] text-[var(--iv-muted)]"
                  style={{ fontFamily: "var(--font-editorial), serif" }}
                >
                  Thinking...
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

      <div className="pointer-events-none fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
        <div className="pointer-events-auto flex items-center gap-6 rounded-full border border-[var(--iv-border)] bg-[var(--iv-surface)]/96 px-6 py-3 backdrop-blur-sm">
          <button
            onClick={onModeToggle}
            className="text-[var(--iv-muted)] transition-colors hover:text-[var(--iv-text)]"
            aria-label="Toggle color mode"
            title="Toggle color mode"
          >
            {mode === "dark" ? <Sun size={18} strokeWidth={1.6} /> : <Moon size={18} strokeWidth={1.6} />}
          </button>
          <button
            onClick={onMicToggle}
            className="text-[var(--iv-muted)] transition-colors hover:text-[var(--iv-text)]"
            aria-label="Toggle microphone"
            title="Toggle microphone"
          >
            {isMicrophoneEnabled ? <Mic size={18} strokeWidth={1.6} /> : <MicOff size={18} strokeWidth={1.6} />}
          </button>
          <button
            onClick={handleCopyTranscript}
            className="text-[var(--iv-muted)] transition-colors hover:text-[var(--iv-text)]"
            aria-label="Copy transcript"
            title="Copy transcript"
          >
            <Copy size={18} strokeWidth={1.6} />
          </button>
          <button
            onClick={handleScrollBottom}
            className="text-[var(--iv-muted)] transition-colors hover:text-[var(--iv-text)]"
            aria-label="Jump to latest message"
            title="Jump to latest"
          >
            <ArrowDown size={18} strokeWidth={1.6} />
          </button>
          <button
            onClick={onEndCall}
            className="text-[var(--iv-muted)] transition-colors hover:text-[var(--iv-text)]"
            aria-label="End interview"
            title="End interview"
          >
            <PhoneOff size={18} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}



