"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Zap, Mic, Database } from "lucide-react";

const tabs = [
  {
    id: "discovery",
    label: "Job Discovery",
    icon: Search,
    color: "bg-[#f9dbbd]",
    title:
      "The Discovery Agent searches through APIs to find hidden job requirements and displays available positions with match scores.",
  },
  {
    id: "apply",
    label: "Auto-Apply",
    icon: Zap,
    color: "bg-[#c3e6f0]",
    title:
      "AI Agent Bot automatically searches LinkedIn, Indeed, and other platforms, then applies to high-match jobs with tailored CVs.",
  },
  {
    id: "simulation",
    label: "Mock Interviews",
    icon: Mic,
    color: "bg-[#f0e4c3]",
    title:
      "The Simulation Loop generates tough interview questions from a recruiter persona to stress-test your profile before the real thing.",
  },
  {
    id: "profile",
    label: "Profile Sync",
    icon: Database,
    color: "bg-[#e0d6f5]",
    title:
      "Semantic Profile Synchronization stores your experience as Atomic Achievements in a vector database for high-fidelity matching.",
  },
];

function TabVisual({ id }: { id: string }) {
  const activeTab = tabs.find(t => t.id === id)!;
  const Icon = activeTab.icon;

  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        layoutId="tabBg"
        className={`absolute inset-0 opacity-10 ${activeTab.color} blur-[120px]`} 
      />
      
      <div className="relative z-10 w-full max-w-[400px] aspect-square bg-white rounded-[32px] border border-black/5 shadow-2xl flex flex-col p-8 overflow-hidden">
        {/* Header UI */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-black/5" />
            <div className="w-3 h-3 rounded-full bg-black/5" />
            <div className="w-3 h-3 rounded-full bg-black/5" />
          </div>
          <Icon className="w-5 h-5 text-black/20" />
        </div>

        {/* Content UI Mockup */}
        <div className="flex-1 flex flex-col gap-4">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "60%" }}
            className="h-4 bg-black/5 rounded-full" 
          />
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "90%" }}
            transition={{ delay: 0.1 }}
            className="h-4 bg-black/5 rounded-full" 
          />
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`h-24 rounded-2xl border border-black/5 flex flex-col p-4 gap-2 ${i === 1 ? activeTab.color + ' opacity-40' : 'bg-off-white'}`}
              >
                <div className="w-8 h-8 rounded-full bg-white/60" />
                <div className="w-full h-2 bg-black/5 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating elements based on tab */}
        <AnimatePresence>
          <motion.div
            key={id + "-float"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-black/5 bg-white shadow-xl flex items-center justify-center p-4 text-center"
          >
            <div className="space-y-1">
              <p className="font-sans text-[10px] font-bold text-black/30 uppercase tracking-tighter">Match</p>
              <p className="font-sans text-[24px] font-medium text-black">94%</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeContent = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="py-32 px-6 lg:px-12 bg-[#FAF9F6]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 mb-20 max-w-[800px]"
        >
          <div className="flex items-center gap-3">
            <span className="label-mono">02 — Use Cases</span>
          </div>
          <h2 className="h2 tracking-tight text-black">
            From discovery to application, fully automated.
          </h2>
        </motion.div>

        {/* Tab Controls */}
        <div className="flex overflow-x-auto no-scrollbar gap-8 border-b border-black/10 -mx-6 px-6 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer pb-6 font-sans text-[16px] font-medium transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-black"
                  : "text-black/40 hover:text-black/70"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[500px]">
          {/* Visual Placeholder */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                <TabVisual id={activeTab} />
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
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <motion.div 
                  layoutId="tabTag"
                  className={`w-fit px-4 py-1.5 rounded-full ${activeContent.color} bg-opacity-30 border border-black/5 font-sans text-[12px] font-semibold text-black italic`}
                >
                  {activeContent.label}
                </motion.div>
                <h3 className="font-sans text-[32px] sm:text-[42px] font-medium leading-[1.2] tracking-tight text-black max-w-[520px]">
                  {activeContent.title}
                </h3>
                <p className="font-sans text-[18px] text-black/50 font-light leading-relaxed max-w-[480px]">
                  Arcaive's AI swarm coordinates these processes autonomously, ensuring your professional profile stays ahead of the market curve without manual intervention.
                </p>
              </div>

              <Link
                href="/register"
                className="btn-icon-capsule group"
              >
                <span className="icon-circle group-hover:bg-black group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
                Get Started
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
