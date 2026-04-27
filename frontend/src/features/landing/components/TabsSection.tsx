"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const tabs = [
  {
    id: "discovery",
    label: "Job Discovery",
    title:
      "The Discovery Agent searches through APIs to find hidden job requirements and displays available positions with match scores.",
  },
  {
    id: "apply",
    label: "Auto-Apply",
    title:
      "AI Agent Bot automatically searches LinkedIn, Indeed, and other platforms, then applies to high-match jobs with tailored CVs.",
  },
  {
    id: "simulation",
    label: "Mock Interviews",
    title:
      "The Simulation Loop generates tough interview questions from a recruiter persona to stress-test your profile before the real thing.",
  },
  {
    id: "profile",
    label: "Profile Sync",
    title:
      "Semantic Profile Synchronization stores your experience as Atomic Achievements in a vector database for high-fidelity matching.",
  },
];

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeContent = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="py-32 px-6 lg:px-10 bg-black border-t border-white/[0.06]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col gap-5 mb-16">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[#D1FF00] tracking-[0.15em]">[04]</span>
            <div className="w-12 h-[1px] bg-white/10" />
            <span className="font-mono text-[11px] text-white/30 uppercase tracking-[0.15em]">
              Use Cases
            </span>
            <span className="font-mono text-[11px] text-white/20">_</span>
          </div>
          <h2 className="font-sans text-[32px] sm:text-[44px] font-bold leading-tight tracking-[-0.03em] text-white uppercase max-w-[700px]">
            From discovery to application —{" "}
            <span className="text-[#D1FF00]">fully automated.</span>
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex overflow-x-auto no-scrollbar gap-0 border-b border-white/[0.06] -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer pb-5 px-6 text-[11px] font-mono font-bold uppercase tracking-[0.15em] transition-colors duration-200 relative whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-[#D1FF00]"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D1FF00]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[400px]">
          {/* Visual */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A0A] border border-white/[0.06] group">
            <div className="absolute inset-0 grid-lines opacity-20" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto border border-[#D1FF00]/30 flex items-center justify-center">
                    <span className="font-mono text-[24px] text-[#D1FF00]">
                      {tabs.findIndex(t => t.id === activeTab) + 1}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">
                    [ {activeContent.label} ]
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="font-mono text-[10px] font-bold text-[#D1FF00]/60 uppercase tracking-[0.3em]">
                  [ {activeContent.label} ]
                </div>
                <h3 className="font-sans text-[24px] sm:text-[32px] font-bold leading-[1.2] tracking-tight text-white uppercase">
                  {activeContent.title}
                </h3>
              </div>

              <Link
                href="/register"
                className="btn-primary inline-flex"
              >
                GET STARTED
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
