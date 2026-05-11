"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function InterviewLoadingScreen({ message = "Agent is Loading..." }: { message?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // GSAP 3D Rings Animation
    if (ringsRef.current.length > 0) {
      ringsRef.current.forEach((ring, index) => {
        // We use slightly offset timelines for chaotic orbit feel
        gsap.to(ring, {
          rotationX: "+=360",
          rotationY: "+=180",
          rotationZ: "+=90",
          duration: 4 + index * 1.5,
          repeat: -1,
          ease: "linear",
          transformOrigin: "center center",
        });
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-color)] z-0 overflow-hidden rounded-[inherit]">
      {/* Dynamic Backglow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--text-primary)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />
      
      <div 
        ref={containerRef}
        className="relative w-40 h-40 flex items-center justify-center mb-16"
        style={{ perspective: "1000px" }}
      >
        {/* Core Glowing Orb */}
        <motion.div 
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-12 h-12 rounded-full bg-[var(--text-primary)] shadow-[0_0_40px_var(--text-primary)]"
        />
        
        {/* 3D Wireframe Rings */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            ref={(el) => { if (el) ringsRef.current[i] = el; }}
            className={`absolute w-36 h-36 rounded-full border-[1.5px] border-[var(--text-primary)] ${i % 2 === 0 ? 'border-dashed opacity-40' : 'border-dotted opacity-20'}`}
            style={{ 
              transformStyle: "preserve-3d",
              transform: `rotateX(${i * 45}deg) rotateY(${i * 20}deg)`
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        <span className="text-sm font-mono tracking-[0.4em] uppercase text-[var(--text-primary)] font-bold">
          {message}
        </span>
        <div className="flex gap-2 items-center">
          <motion.div animate={{ height: [4, 16, 4] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0, ease: "easeInOut" }} className="w-1 rounded-full bg-[var(--text-primary)] opacity-80" />
          <motion.div animate={{ height: [4, 16, 4] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2, ease: "easeInOut" }} className="w-1 rounded-full bg-[var(--text-primary)] opacity-80" />
          <motion.div animate={{ height: [4, 16, 4] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4, ease: "easeInOut" }} className="w-1 rounded-full bg-[var(--text-primary)] opacity-80" />
        </div>
      </motion.div>
    </div>
  );
}
