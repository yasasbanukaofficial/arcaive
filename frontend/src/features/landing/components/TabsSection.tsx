"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import FloatingCubes from "./FloatingCubes";

const tabs = [
  {
    id: "discovery",
    label: "Discovery",
    title: "The Agent Swarm searches through global job ecosystems to identify hidden high-signal opportunities.",
    desc: "By deconstructing complex job descriptions into raw semantic data, we match your profile with 98% accuracy to roles you didn't even know existed.",
  },
  {
    id: "apply",
    label: "Automation",
    title: "AI Bot autonomously handles the entire submission lifecycle with surgical precision.",
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
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="bg-white py-40 px-6 lg:px-12 relative border-b border-black/[0.03]">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          {/* Controls - Left side */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            <div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30 mb-8 block">02 — The Capabilities</span>
              <h2 className="font-sans text-[48px] font-medium leading-[1] tracking-tight text-black">
                Engineered for outcome.
              </h2>
            </div>

            <div className="flex flex-col border-t border-black/[0.06]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-8 border-b border-black/[0.06] text-left transition-all relative group ${
                    activeTab === tab.id ? "text-black" : "text-black/30 hover:text-black/60"
                  }`}
                >
                  <span className="font-sans text-[20px] font-medium tracking-tight">
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tabUnderline"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content - Right side */}
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/10] bg-[#FAF9F6] rounded-3xl overflow-hidden border border-black/[0.03] p-12 lg:p-20 flex flex-col justify-center">
              <FloatingCubes />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-[600px] relative z-10"
                >
                  <h3 className="font-sans text-[32px] sm:text-[42px] font-medium leading-[1.2] tracking-tight text-black mb-8">
                    {active.title}
                  </h3>
                  <p className="font-sans text-[18px] text-black/40 leading-relaxed">
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
