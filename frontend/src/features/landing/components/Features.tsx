"use client";

import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import VoiceAgentAnimation from "./VoiceAgentAnimation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Features() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".editorial-text", {
      x: -50,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
      },
    });

    gsap.from(".animation-container", {
      scale: 0.9,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
      },
    });
  }, { scope: container });

  return (
    <section 
      id="features" 
      ref={container}
      className="bg-white pt-12 md:pt-16 pb-12 px-6 lg:px-12 relative border-b border-black/[0.03]"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Editorial Content */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8 editorial-text">
            <div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-black/30 mb-8 block">
                01 — The Foundation
              </span>
              <h2 className="font-sans text-[48px] sm:text-[64px] lg:text-[80px] font-medium leading-[0.9] tracking-[-0.04em] text-black">
                Architecting the <br />
                <span className="text-black/30 italic">future of work.</span>
              </h2>
            </div>
            
            <p className="font-sans text-[18px] sm:text-[22px] text-black/40 leading-relaxed max-w-[480px]">
              We've built a multi-agent ecosystem that translates your career into the language of high-growth firms.
            </p>

            <Link href="/register" className="group flex items-center gap-4 w-fit">
              <span className="font-sans text-[13px] font-bold uppercase tracking-widest text-black group-hover:translate-x-2 transition-transform duration-500">
                Explore the engine
              </span>
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* 3D Scene */}
          <div className="lg:col-span-12 xl:col-span-7 flex justify-center animation-container">
            <div className="w-full aspect-[16/9] lg:aspect-auto lg:h-[350px] rounded-[32px] overflow-hidden bg-[#FAF9F6] border border-black/[0.03] relative group">
              <VoiceAgentAnimation />
              <div className="absolute top-12 left-12">
                <span className="font-mono text-[10px] uppercase tracking-widest text-black/30">Interface Status</span>
                <p className="font-sans text-[14px] font-medium text-black">Voice Agent Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
