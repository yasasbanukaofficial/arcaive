"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
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
      duration: 1,
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
      className="bg-white py-32 px-6 lg:px-12 border-b border-black/[0.03]"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-black/[0.06]">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="value-card group p-12 lg:p-20 border-r border-b border-black/[0.06] hover:bg-[#FAF9F6] transition-colors duration-700"
            >
              <span className="font-mono text-[11px] font-bold text-black/20 mb-12 block tracking-widest">
                SECTION {feature.id}
              </span>
              <h3 className="font-sans text-[32px] font-medium leading-[1.1] tracking-tight text-black mb-8 group-hover:translate-x-2 transition-transform duration-700">
                {feature.title}
              </h3>
              <p className="font-sans text-[18px] text-black/40 leading-relaxed max-w-[320px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
