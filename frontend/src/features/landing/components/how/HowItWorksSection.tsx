"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    phase: "01",
    title: "Analysis",
    description: "Multi-agent swarm decomposes your CV into raw vector signal.",
  },
  {
    phase: "02",
    title: "Discovery",
    description: "Scan global ecosystems for highest-signal role alignment.",
  },
  {
    phase: "03",
    title: "Submission",
    description: "Autonomous delivery of hyper-tailored professional data.",
  }
];

export default function HowItWorksSection() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".step-card", {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
      },
    });
  }, { scope: container });

  return (
    <section 
      id="howitworks" 
      ref={container}
      className="bg-transparent py-40 px-6 lg:px-12 relative"
    >
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="flex flex-col gap-10 mb-20">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 font-mono">FLOW.INIT()</span>
          <h2 className="font-sans text-[48px] sm:text-[64px] font-medium leading-[1] tracking-[-0.05em] text-white max-w-[600px]">
            The Journey <br />
            <span className="text-white/20 italic font-light">to autonomous success.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="step-card flex flex-col gap-8 p-12 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[48px] hover:bg-white/[0.05] transition-all duration-700">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center font-mono text-[14px] text-white/40">
                {step.phase}
              </div>
              <div>
                <h3 className="font-sans text-[28px] font-medium text-white mb-4">{step.title}</h3>
                <p className="font-sans text-[16px] text-white/30 leading-relaxed font-light italic">
                  {step.description}
                </p>
              </div>

              {/* Progress visual between cards */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-white/10">
                  <span className="font-mono text-[24px]">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
