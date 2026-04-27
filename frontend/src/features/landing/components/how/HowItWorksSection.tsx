"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    phase: "PHASE_01",
    title: "Analysis.",
    description: "Multi-agent swarm decomposes your CV into raw vector signal.",
  },
  {
    phase: "PHASE_02",
    title: "Discovery.",
    description: "Scan global ecosystems for highest-signal role alignment.",
  },
  {
    phase: "PHASE_03",
    title: "Execution.",
    description: "Autonomous delivery of hyper-tailored professional data.",
  },
];

export default function HowItWorksSection() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".hiw-reveal", {
      opacity: 0,
      y: 60,
      duration: 1.5,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
      },
    });
  }, { scope: container });

  return (
    <section id="howitworks" ref={container} className="scene-section">
      <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        
        {/* Left massive text */}
        <div className="lg:col-span-5 feature-reveal hiw-reveal">
          <h2 className="leading-[1] text-[var(--text-primary)] font-bold font-sans tracking-tight" style={{ fontSize: "clamp(48px, 6vw, 90px)"}}>
            BUILT TO<br/>
            EXECUTE.
          </h2>
          <p className="mt-12 font-sans text-[22px] text-[var(--text-secondary)] leading-[1.4] font-medium max-w-[400px]">
            From raw document analysis to final execution, the flow is entirely autonomous.
          </p>
        </div>

        {/* Right list items */}
        <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-16 hiw-reveal">
          {steps.map((step, i) => (
             <div key={i} className="flex gap-12 group">
               <div className="font-sans text-[32px] font-medium text-[var(--text-secondary)] pt-1">
                 {String(i + 1).padStart(2, '0')}.
               </div>
               <div className="flex flex-col gap-4 border-b border-[var(--border-light)] pb-12 w-full">
                 <span className="oryzo-label text-[var(--text-secondary)]">{step.phase}</span>
                 <h3 className="font-sans text-[36px] font-medium text-[var(--text-primary)] tracking-tight">
                   {step.title}
                 </h3>
                 <p className="font-sans text-[18px] text-[var(--text-secondary)] max-w-[300px]">
                   {step.description}
                 </p>
               </div>
             </div>
          ))}
        </div>

      </div>
    </section>
  );
}
