"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const plans = [
  {
    name: "Explorer",
    price: 0,
    desc: "Essential AI tools to get started.",
    features: ["3 CV analyses/month", "1 mock interview/month", "5 job results/set", "Manual job input"],
  },
  {
    name: "Strategist",
    price: 19,
    desc: "Advanced tools for serious seekers.",
    features: ["20 CV analyses/month", "15 mock interviews/month", "20 job results/set", "10 auto-applications/month", "AI CV rewriting"],
    popular: true,
  },
  {
    name: "Architect",
    price: 42,
    desc: "Unlimited access for professionals.",
    features: ["Unlimited CV analyses", "Unlimited mock interviews", "50 job results/set", "Priority AI queue", "Early feature access"],
  },
];

export default function PricingSection() {
  const router = useRouter();

  return (
    <section id="pricing" className="bg-transparent py-40 px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="flex flex-col gap-8 mb-24">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-white/30">05 — Investment</span>
          <h2 className="font-sans text-[48px] sm:text-[64px] font-medium leading-[1] tracking-tight text-white max-w-[800px]">
            Access the intelligence.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 group">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col p-10 sm:p-16 border-r border-b border-white/10 hover:bg-white/[0.04] transition-all duration-700 relative overflow-hidden ${plan.popular ? "bg-white/[0.02]" : ""}`}
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">Protocol {i+1}</span>
                {plan.popular && (
                  <span className="px-3 py-1 bg-white text-black text-[9px] font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]">Recommended</span>
                )}
              </div>

              <h3 className="font-sans text-[36px] font-medium text-white mb-4 tracking-tight">{plan.name}</h3>
              <p className="font-sans text-[16px] text-white/40 mb-16 leading-relaxed max-w-[240px] font-light italic">{plan.desc}</p>

              <div className="flex items-baseline gap-3 mb-20 animate-pulse">
                <span className="font-sans text-[20px] text-white/20 uppercase font-bold tracking-widest">€</span>
                <span className="font-sans text-[72px] sm:text-[90px] font-medium text-white tracking-[-0.08em] leading-none">
                  {plan.price}
                </span>
                <span className="font-sans text-[12px] font-bold text-white/20 uppercase tracking-[0.3em]">/ month</span>
              </div>

              <div className="flex flex-col gap-6 mb-24">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-4 group/item">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/item:bg-white transition-colors" />
                    <span className="font-sans text-[15px] text-white/40 group-hover/item:text-white transition-colors leading-relaxed font-light">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => router.push(`/subscription/checkout?plan=${plan.name.toLowerCase()}&billing=month`)}
                className={`mt-auto flex items-center justify-between w-full p-8 font-sans text-[13px] font-bold uppercase tracking-[0.3em] transition-all duration-700 group/btn ${
                  plan.popular 
                  ? "bg-white text-black hover:bg-white/90" 
                  : "border border-white/20 text-white hover:bg-white hover:text-black"
                }`}
              >
                Select Protocol
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
