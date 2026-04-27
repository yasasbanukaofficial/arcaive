"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import AnimatedPrice from "./AnimatedPrice";

export default function PricingSection() {
  const router = useRouter();
  const [isYearly, setIsYearly] = React.useState(false);

  const plans = [
    {
      name: "Explorer",
      price: 0,
      desc: "Essential AI tools to get started.",
      features: ["3 CV analyses/month", "1 mock interview/month", "5 job results/set", "Manual job input"],
    },
    {
      name: "Strategist",
      price: 12,
      desc: "Advanced tools for serious seekers.",
      features: ["20 CV analyses/month", "15 mock interviews/month", "20 job results/set", "10 auto-applications/month", "AI CV rewriting"],
      popular: true,
    },
    {
      name: "Architect",
      price: 29,
      desc: "Unlimited access for professionals.",
      features: ["Unlimited CV analyses", "Unlimited mock interviews", "50 job results/set", "Priority AI queue", "Early feature access"],
    },
  ];

  return (
    <section id="pricing" className="bg-white py-40 px-6 lg:px-12 relative border-b border-black/[0.03]">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">05 — Investment</span>
            <h2 className="font-sans text-[48px] sm:text-[64px] font-medium leading-[1] tracking-[-0.04em] text-black max-w-[600px]">
              Access the intelligence.
            </h2>
          </motion.div>

          <div className="flex items-center p-1 bg-black/[0.03] rounded-full border border-black/[0.05]">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-8 py-3 rounded-full font-sans text-[11px] font-bold uppercase tracking-widest transition-all ${
                !isYearly ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-8 py-3 rounded-full font-sans text-[11px] font-bold uppercase tracking-widest transition-all ${
                isYearly ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black/[0.06]">
          {plans.map((plan, i) => {
            const displayPrice = isYearly ? Math.floor(plan.price * 0.8) : plan.price;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`flex flex-col py-20 px-4 group first:pl-0 last:pr-0 ${i !== plans.length - 1 ? "border-r border-black/[0.06]" : ""} ${i === 1 ? "md:px-20" : i === 2 ? "md:pl-20" : "md:pr-20"}`}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">Phase {i+1}</span>
                  {plan.popular && (
                    <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Recommended</span>
                  )}
                </div>

                <h3 className="font-sans text-[42px] font-medium text-black mb-4 tracking-tight">{plan.name}</h3>
                <p className="font-sans text-[16px] text-black/40 mb-12 leading-relaxed max-w-[200px]">{plan.desc}</p>

                <div className="flex items-baseline gap-2 mb-16">
                  <span className="font-sans text-[64px] font-medium text-black tracking-tighter">€<AnimatedPrice value={displayPrice} /></span>
                  <span className="font-sans text-[12px] font-bold text-black/20 uppercase tracking-[0.15em]">/ month</span>
                </div>

                <div className="flex flex-col gap-5 mb-20">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-4 group/item">
                      <div className="w-1 h-1 rounded-full bg-black/20 group-hover/item:bg-black transition-colors" />
                      <span className="font-sans text-[14px] text-black/60">{f}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => router.push(`/subscription/checkout?plan=${plan.name.toLowerCase()}&billing=${isYearly ? "year" : "month"}`)}
                  className="mt-auto flex items-center justify-between w-full p-6 border border-black text-black font-sans text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all group/btn"
                >
                  Select Plan
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
