"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/layout/SectionHeader";
import UnfoldText from "@/components/ui/UnfoldText";
import { bounceIn, staggerContainer } from "@/components/animations/variants";

const tabs = [
  {
    id: "discovery",
    label: "Job Discovery",
    title:
      "The Discovery Agent searches through APIs to find hidden job requirements and displays available positions with match scores.",
    image: "/images/hero-bg.png",
  },
  {
    id: "apply",
    label: "Auto-Apply",
    title:
      "AI Agent Bot automatically searches LinkedIn, Indeed, and other platforms, then applies to high-match jobs with tailored CVs.",
    image: "/images/hero-bg.png",
  },
  {
    id: "simulation",
    label: "Mock Interviews",
    title:
      "The Simulation Loop generates tough interview questions from a recruiter persona to stress-test your profile before the real thing.",
    image: "/images/hero-bg.png",
  },
  {
    id: "profile",
    label: "Profile Sync",
    title:
      "Semantic Profile Synchronization stores your experience as Atomic Achievements in a vector database for high-fidelity matching.",
    image: "/images/hero-bg.png",
  },
];

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeContent = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-8 sm:mb-10 md:mb-12 text-left">
          <SectionHeader
            label="Use Cases"
            title="From discovery to application — fully automated by intelligent agents."
          />
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-6 sm:gap-8 md:gap-12 mb-10 sm:mb-12 md:mb-16 border-b border-white/10 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer pb-4 sm:pb-5 md:pb-6 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-[color] duration-200 relative whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-[#888880] hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer(0.2, 0.1)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center min-h-0 lg:min-h-[400px]"
        >
          <motion.div
            variants={bounceIn}
            className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-white/[0.02] border border-white/10 group"
            style={{ borderRadius: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={activeContent.image}
                  alt={activeContent.label}
                  fill
                  className="object-cover opacity-30 grayscale group-hover:opacity-50 transition-opacity duration-700"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div variants={bounceIn}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 sm:space-y-6 md:space-y-8"
              >
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <div className="font-mono text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
                    [ {activeContent.label} ]
                  </div>
                  <h3 className="font-sans text-xl sm:text-2xl md:text-[36px] font-bold leading-[1.2] tracking-tight text-white uppercase">
                    {activeContent.title}
                  </h3>
                </div>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center bg-white text-black px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-widest border border-white hover:bg-black hover:text-white transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  GET_STARTED
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
