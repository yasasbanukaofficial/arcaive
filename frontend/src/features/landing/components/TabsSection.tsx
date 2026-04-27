"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const tabs = [
  {
    id: "discovery",
    label: "Discovery",
    title: "The Agent Swarm searches through global ecosystems for hidden high-signal roles.",
    desc: "By deconstructing complex job descriptions into raw semantic data, we match your profile with 98% accuracy to roles you didn't even know existed.",
  },
  {
    id: "apply",
    label: "Automation",
    title: "AI Bot autonomously handles the entire submission lifecycle with precision.",
    desc: "From profile synchronization to hyper-tailored resume generation, every application is optimized to clear tracking systems and reach human eyes.",
  },
  {
    id: "simulation",
    label: "Simulation",
    title: "Refine your narrative with role-specific AI interviewers before the real thing.",
    desc: "Our simulation loop generates high-pressure scenarios derived from millions of real-world hiring processes to stress-test your professional readiness.",
  },
];

export default function TabsSection() {
  const container = useRef(null);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const active = tabs.find((t) => t.id === activeTab)!;

  useGSAP(() => {
    gsap.from(".tab-reveal", {
      opacity: 0,
      x: -40,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 65%",
      },
    });
  }, { scope: container });

  return (
    <section ref={container} className="scene-container py-40 px-6 lg:px-12 border-b border-white/[0.06]">
      <div className="content-wrapper w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Controls - Left side */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div className="tab-reveal">
              <span className="section-label mb-8 block">Capabilities</span>
              <h2 className="font-sans text-[clamp(42px,5vw,64px)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
                Engineered for <br/>
                <span className="text-white/15 font-light italic">outcome.</span>
              </h2>
            </div>

            <div className="flex flex-col border-t border-white/[0.06]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-reveal py-8 border-b border-white/[0.06] text-left transition-all relative group ${
                    activeTab === tab.id ? "text-white" : "text-white/20 hover:text-white/40"
                  }`}
                >
                  <span className="font-sans text-[22px] font-medium tracking-tight">
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tabUnderline"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--glass-bg)] shadow-[0_0_15px_white]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content - Right side */}
          <div className="lg:col-span-7 tab-reveal">
            <div className="glass-card aspect-[4/3] rounded-[48px] overflow-hidden p-12 lg:p-20 flex flex-col justify-center translate-y-0 hover:-translate-y-2 transition-transform duration-700 shadow-[0_0_80px_rgba(255,255,255,0.02)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-[600px] relative z-10"
                >
                  <span className="hud-label block mb-8 text-white/30">Module: {active.label}</span>
                  <h3 className="font-sans text-[28px] sm:text-[36px] font-medium leading-[1.3] tracking-[-0.03em] text-white mb-8">
                    {active.title}
                  </h3>
                  <p className="font-sans text-[16px] text-white/30 leading-relaxed font-light italic">
                    {active.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
