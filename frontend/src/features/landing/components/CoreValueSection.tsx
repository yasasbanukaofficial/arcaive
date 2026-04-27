"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    id: "01",
    title: "Multi-agent swarm for CV analysis.",
    description: "Our agents synchronize to deconstruct your experience into high-fidelity data points, ensuring no achievement is lost in translation.",
  },
  {
    id: "02",
    title: "Autonomous job hunting at scale.",
    description: "The swarm scans global job ecosystems, evaluates cultural fit, and executes hyper-tailored submissions while you sleep.",
  },
  {
    id: "03",
    title: "Predictive recruitment dynamics.",
    description: "Advanced semantic modeling anticipates market shifts and positions your personal brand ahead of the emerging demand curve.",
  }
];

export default function CoreValueSection() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".value-card", {
      opacity: 0,
      y: 40,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
    });
  }, { scope: container });

  return (
    <section 
      ref={container}
      className="bg-transparent py-40 px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-white/10">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="value-card group p-12 lg:p-20 border-r border-b border-white/10 hover:bg-white/[0.03] transition-colors duration-700"
            >
              <span className="font-mono text-[11px] font-bold text-white/20 mb-12 block tracking-[0.3em]">
                MODALITY {feature.id}
              </span>
              <h3 className="font-sans text-[32px] font-medium leading-[1.1] tracking-tight text-white mb-8 group-hover:translate-x-2 transition-transform duration-700">
                {feature.title}
              </h3>
              <p className="font-sans text-[18px] text-white/40 leading-relaxed max-w-[320px] font-light italic">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
