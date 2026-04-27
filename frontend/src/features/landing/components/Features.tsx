"use client";

import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Features() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".voice-viz-bar", {
      height: 2,
      duration: 1,
      stagger: {
        each: 0.05,
        from: "center",
        repeat: -1,
        yoyo: true
      },
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
      }
    });
  }, { scope: container });

  return (
    <section 
      id="features" 
      ref={container}
      className="bg-transparent py-40 px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-12 xl:col-span-6 flex flex-col gap-10">
            <div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 mb-6 block font-mono">
                AI_INTERFACE.EXEC()
              </span>
              <h2 className="font-sans text-[56px] sm:text-[72px] lg:text-[80px] font-medium leading-[0.9] tracking-[-0.05em] text-white">
                The Voice <br />
                <span className="text-white/20 italic font-light">of authority.</span>
              </h2>
            </div>
            
            <p className="font-sans text-[20px] text-white/40 leading-relaxed max-w-[480px] font-light italic">
              Perform high-pressure mock interviews with our sovereign voice agents. High-fidelity semantic analysis refined for market entry.
            </p>

            <Link href="/register" className="group flex items-center gap-6 w-fit bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500">
              <span className="font-sans text-[13px] font-bold uppercase tracking-widest">
                Start Simulation
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="lg:col-span-12 xl:col-span-6">
            <div className="aspect-video relative flex items-end justify-center p-12 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[48px] overflow-hidden group">
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[4px] text-white/40">Voice Agent Status</span>
                <span className="font-sans text-[12px] font-bold text-white uppercase tracking-widest animate-pulse">Listening...</span>
              </div>

              {/* Voice Visualization Bars */}
              <div className="flex items-end gap-1.5 h-32 w-full max-w-[400px]">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="voice-viz-bar flex-1 bg-white/20 rounded-full"
                    style={{ height: `${20 + Math.random() * 80}%` }}
                  />
                ))}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
