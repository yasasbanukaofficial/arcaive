"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const tabs = [
  {
    id: "content",
    label: "Content Creation",
    title: "Bring stories, posts, and ideas to life with words that flow naturally.",
    image: "/images/hero-bg.png",
  },
  {
    id: "coding",
    label: "Coding Help",
    title: "Accelerate your development workflow with intelligent code suggestions.",
    image: "/images/hero-bg.png",
  },
  {
    id: "research",
    label: "Research & Insights",
    title: "Distill complex information into actionable insights in seconds.",
    image: "/images/hero-bg.png",
  },
  {
    id: "focus",
    label: "Focus & productivity",
    title: "Organize your life and maintain peak performance with guided focus.",
    image: "/images/hero-bg.png",
  },
];

const UnfoldText = ({ text }: { text: string }) => {
  const words = text.split(" ");
  
  return (
    <span className="inline-flex flex-wrap gap-x-[0.2em] overflow-visible">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-[0.1em] -my-[0.1em]">
          <motion.span
            initial={{ opacity: 0, filter: "blur(8px)", y: "100%" }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeContent = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="py-32 px-6 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-20">
          <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em] block mb-4">• Use cases</span>
          <h2 className="text-[32px] md:text-[52px] font-medium tracking-[-0.03em] leading-[1.1] text-white">
            <UnfoldText text="Different paths to explore all guided by one silent companion." />
          </h2>
        </div>

        {/* Tab Headers */}
        <div className="flex flex-wrap gap-8 md:gap-12 mb-16 border-b border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-6 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab.id ? "text-white" : "text-white/30 hover:text-white/50"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[400px]">
          <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden bg-white/[0.02] border border-white/5 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeContent.image}
                  alt={activeContent.label}
                  fill
                  className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700 saturate-0 group-hover:saturate-100"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em]">{activeContent.label}</span>
                <h3 className="text-2xl md:text-[36px] font-medium leading-[1.2] tracking-tight text-white/90">
                  {activeContent.title}
                </h3>
              </div>
              
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center bg-white text-[#0f0f0f] px-8 py-3 rounded-full text-[13px] font-bold hover:scale-[1.05] transition-all"
              >
                Get started
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
