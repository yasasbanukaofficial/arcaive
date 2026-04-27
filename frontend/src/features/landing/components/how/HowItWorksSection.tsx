"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import PulseSphere from "../PulseSphere";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    phase: "01",
    title: "Analysis",
    description: "Our swarm deconstructs your career trajectory into raw data, identifying high-signal achievements that define your professional worth.",
  },
  {
    phase: "02",
    title: "Discovery",
    description: "Live market agents scan global job ecosystems, matching your profile with surgical precision to roles that fit your ambitions.",
  },
  {
    phase: "03",
    title: "Submission",
    description: "Hyper-tailored applications are delivered with bespoke optimizations that clear every digital barrier and catch human eyes.",
  },
  {
    phase: "04",
    title: "Execution",
    description: "Prepare with role-specific AI interviewers. Refine your narrative until your entry into the world's leading firms is secured.",
  },
];

export default function HowItWorksSection() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".step-row", {
      opacity: 0,
      x: 30,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
      },
    });
  }, { scope: container });

  return (
    <section 
      id="howitworks" 
      ref={container}
      className="bg-[#FAF9F6] py-40 px-6 lg:px-12 relative border-b border-black/[0.03]"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left Side - Sticky 3D Element */}
          <div className="lg:col-span-5 lg:sticky lg:top-40">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F2F0EA] flex items-center justify-center">
              <PulseSphere />
              <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
            </div>
          </div>

          {/* Right Side - Steps */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            <div className="mb-20">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30 mb-8 block">04 — The Methodology</span>
              <h2 className="font-sans text-[48px] sm:text-[64px] font-medium leading-[1] tracking-[-0.04em] text-black max-w-[500px]">
                A refined path to your new reality.
              </h2>
            </div>

            <div className="flex flex-col">
              {steps.map((step, i) => (
                <div
                  key={step.phase}
                  className="step-row group flex flex-col border-t border-black/[0.06] py-16 last:border-b last:border-black/[0.06]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    <span className="md:col-span-1 font-mono text-[11px] font-bold text-black/20 pt-2">({step.phase})</span>
                    <div className="md:col-span-11">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-sans text-[32px] font-medium text-black tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                            {step.title}
                          </h3>
                        </div>
                        <div>
                          <p className="font-sans text-[18px] text-black/50 leading-relaxed max-w-[400px]">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
