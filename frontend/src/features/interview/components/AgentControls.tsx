import { AgentAudioVisualizerBar } from "@/components/agents-ui/agent-audio-visualizer-bar";
import { AgentChatTranscript } from "@/components/agents-ui/agent-chat-transcript";
import { useAgent, useSessionMessages } from "@livekit/components-react";
import { Mic, User, MessageSquare, ListTodo, Sparkles, Send, BrainCircuit } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Float, MeshDistortMaterial } from "@react-three/drei";

function AIAvatar() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.2;
      ringRef.current.rotation.x = t * 0.1;
    }
  });

  return (
    <group scale={1.8}>
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#000000" emissive="#000000" metalness={1} roughness={0} />
          <meshBasicMaterial color="#000000" wireframe />
        </mesh>
        <group ref={ringRef}>
           <mesh rotation={[Math.PI / 2, 0, 0]}>
             <torusGeometry args={[1.5, 0.02, 16, 100]} />
             <meshBasicMaterial color="#000000" transparent opacity={0.3} />
           </mesh>
        </group>
      </Float>
      <pointLight intensity={5} color="#000000" />
    </group>
  );
}

function AIAvatarDark() {
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Group>(null);
  
    useFrame((state) => {
      const t = state.clock.getElapsedTime();
      if (meshRef.current) {
        meshRef.current.rotation.y = t * 0.5;
        meshRef.current.rotation.x = t * 0.2;
      }
      if (ringRef.current) {
        ringRef.current.rotation.z = -t * 0.3;
        ringRef.current.rotation.y = t * 0.1;
      }
    });
  
    return (
      <group scale={1.8}>
        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
          <mesh ref={meshRef}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} metalness={1} roughness={0} />
          </mesh>
          <group ref={ringRef}>
             <mesh rotation={[Math.PI / 2, 0, 0]}>
               <torusGeometry args={[1.5, 0.015, 16, 100]} />
               <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
             </mesh>
             <mesh rotation={[0, Math.PI / 2, 0]}>
               <torusGeometry args={[1.7, 0.01, 16, 100]} />
               <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
             </mesh>
          </group>
        </Float>
        <pointLight intensity={10} color="#ffffff" distance={5} />
      </group>
    );
  }

export default function AgentControls() {
  const { state, microphoneTrack } = useAgent();
  const { messages } = useSessionMessages();
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <>
      <div className="flex-1 flex flex-col gap-6 sm:gap-8 min-w-0 h-full">
        {/* Main Agent Viewport */}
        <div className="flex-1 relative bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-hidden group shadow-2xl">
          <div className="absolute inset-0">
             <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--text-primary)] opacity-[0.02]" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-12 sm:gap-16">
              <div className="w-48 h-48 sm:w-64 sm:h-64 relative">
                <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
                   <ambientLight intensity={0.5} />
                   {isDark ? <AIAvatarDark /> : <AIAvatar />}
                </Canvas>
                <div className="absolute inset-0 rounded-full border border-[var(--glass-border)] opacity-20 scale-110 pointer-events-none" />
              </div>
              
              <div className="h-16 flex flex-col items-center gap-4">
                <AgentAudioVisualizerBar
                  size="lg"
                  color={isDark ? "#ffffff" : "#000000"}
                  barCount={20}
                  state={state}
                  audioTrack={microphoneTrack}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-[var(--text-secondary)] animate-pulse">
                   {state === 'speaking' ? 'Agent Transmitting' : state === 'listening' ? 'Agent Neutral' : 'Synchronizing'}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute top-6 left-6 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[var(--text-primary)]" />
             <span className="font-mono text-[9px] uppercase tracking-widest font-black">Arcaive OS v2.0</span>
          </div>

          <div className="absolute bottom-6 left-6 flex items-center gap-4 px-5 py-2.5 bg-[var(--text-primary)] text-[var(--bg-color)]">
            <BrainCircuit className="w-4 h-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Autonomous Interrogator</span>
          </div>
        </div>

        {/* Self View & Candidate Stats */}
        <div className="h-48 flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-2 shrink-0">
          <div className="aspect-video h-full bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-hidden relative group hover:border-[var(--text-primary)] transition-all duration-500 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-[var(--bg-color)] flex items-center justify-center border border-[var(--glass-border)] group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-[var(--text-primary)]" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-[var(--text-primary)] text-[var(--bg-color)]">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest">Candidate 01</span>
            </div>
          </div>
          
          <div className="flex-1 h-full bg-[var(--glass-bg)] border border-[var(--glass-border)] border-dashed flex flex-col items-center justify-center gap-3 p-6 group hover:border-[var(--text-primary)] transition-all">
             <Sparkles className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
             <p className="font-mono text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest text-center group-hover:text-[var(--text-primary)]">Enhanced Sentiment Analysis Grid</p>
          </div>
        </div>
      </div>

      {/* Sidebar - Transcript & Insights */}
      <div className="w-full lg:w-[420px] flex flex-col gap-6 sm:gap-8 shrink-0 lg:h-full min-h-0">
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-8 flex flex-col flex-[3] min-h-0 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <ListTodo className="w-12 h-12" />
          </div>
          <div className="flex items-center justify-between mb-8 border-b border-[var(--glass-border)] pb-4">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--text-primary)]">Behavioral Engine</h3>
          </div>
          <div className="flex-1 font-sans text-[14px] leading-relaxed text-[var(--text-secondary)] overflow-y-auto no-scrollbar uppercase tracking-tight">
             Neural analysis indicates a potential focus on React performance and state management. The AI is optimizing its next query for architectural depth.
          </div>
        </div>

        <div className="relative bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col flex-[7] overflow-hidden shadow-2xl min-h-0">
          <div className="p-6 border-b border-[var(--glass-border)] flex items-center justify-between shrink-0 bg-[var(--glass-border)] relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--bg-color)] border border-[var(--glass-border)]">
                <MessageSquare className="w-4 h-4 text-[var(--text-primary)]" />
              </div>
              <div>
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Secure Transcript</h3>
                <p className="font-mono text-[9px] text-[var(--text-secondary)] uppercase mt-0.5 tracking-widest">End-to-End Encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[var(--text-primary)] text-[var(--bg-color)] h-fit">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative z-10 min-h-0 p-2">
            <AgentChatTranscript agentState={state} messages={messages} className="h-full" />
          </div>
        </div>
      </div>
    </>
  );
}




