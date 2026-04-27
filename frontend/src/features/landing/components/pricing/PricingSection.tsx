"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import AnimatedPrice from "./AnimatedPrice";

const PricingSection = () => {
  const router = useRouter();
  const [isYearly, setIsYearly] = React.useState(false);

  const planIdMap: Record<string, string> = {
    Explorer: "explorer",
    Strategist: "strategist",
    Architect: "architect",
  };

  const handlePlanSelect = (planName: string) => {
    const planId = planIdMap[planName];
    if (planId) {
      router.push(`/subscription/checkout?plan=${planId}&billing=${isYearly ? "year" : "month"}`);
    }
  };

  const pricingPlans = [
    {
      plan: "Explorer",
      price: 0,
      description: "Essential AI tools to get started with AI-powered job hunting.",
      buttonText: "Start for Free",
      features: [
        "3 CV analyses/month",
        "1 mock interview/month",
        "5 job results/set",
        "Manual job input",
        "1 CV version stored",
      ],
    },
    {
      plan: "Strategist",
      price: 12,
      description: "Advanced AI tools for serious job seekers who want to scale.",
      buttonText: "Upgrade to Strategist",
      popular: true,
      features: [
        "20 CV analyses/month",
        "15 mock interviews/month",
        "20 job results/set",
        "10 auto-applications/month",
        "AI CV rewriting",
        "5 CV versions stored",
        "Agent transparency",
      ],
    },
    {
      plan: "Architect",
      price: 29,
      description: "Unlimited access with priority processing for maximum productivity.",
      buttonText: "Get Architect",
      features: [
        "Unlimited CV analyses",
        "Unlimited mock interviews",
        "50 job results/set",
        "Unlimited auto-apply",
        "Priority AI queue",
        "Unlimited CV versions",
        "Early feature access",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="section-cream py-32 px-6 lg:px-10 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] text-black/30 tracking-[0.15em]">[07]</span>
              <div className="w-12 h-[1px] bg-black/10" />
              <span className="font-mono text-[11px] text-black/30 uppercase tracking-[0.15em]">Pricing</span>
            </div>
            <h2 className="font-sans text-[36px] sm:text-[48px] font-bold leading-tight tracking-[-0.03em] text-black uppercase">
              Flexible pricing<br />
              for every stage.
            </h2>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-8 pb-2">
            <button
              onClick={() => setIsYearly(false)}
              className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 pb-1 border-b ${
                !isYearly ? "text-black border-black" : "text-black/30 border-transparent"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 pb-1 border-b ${
                isYearly ? "text-black border-black" : "text-black/30 border-transparent"
              }`}
            >
              Annual (-20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-black/10">
          {pricingPlans.map((plan, index) => {
            const displayPrice = typeof plan.price === "number"
              ? isYearly ? Math.floor(plan.price * 0.8) : plan.price
              : plan.price;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-10 flex flex-col border-r border-b border-black/10 transition-colors ${
                  plan.popular ? "bg-black text-white" : "bg-transparent"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-6 right-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#D1FF00] border border-[#D1FF00] px-2 py-1">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-10">
                  <h4 className={`font-mono text-[11px] uppercase tracking-[0.2em] mb-8 ${
                    plan.popular ? "text-white/40" : "text-black/30"
                  }`}>
                    {plan.plan}
                  </h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className={`font-sans text-[56px] font-bold leading-tight tracking-tight ${
                      plan.popular ? "text-white" : "text-black"
                    }`}>
                      {typeof plan.price === "number" && "€"}
                      <AnimatePresence mode="wait">
                        <AnimatedPrice value={displayPrice} />
                      </AnimatePresence>
                    </span>
                    {typeof plan.price === "number" && (
                      <span className={`font-mono text-[11px] uppercase tracking-[0.15em] ml-2 ${
                        plan.popular ? "text-white/40" : "text-black/30"
                      }`}>
                        /month
                      </span>
                    )}
                  </div>
                  <p className={`font-sans text-[14px] leading-relaxed ${
                    plan.popular ? "text-white/50" : "text-black/40"
                  }`}>
                    {plan.description}
                  </p>
                </div>

                <div className={`w-full h-[1px] mb-10 ${
                  plan.popular ? "bg-white/10" : "bg-black/10"
                }`} />

                <div className="flex-1">
                  <ul className="space-y-4 mb-12">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-3 font-sans text-[14px] ${
                          plan.popular ? "text-white/80" : "text-black/70"
                        }`}
                      >
                        <span className={plan.popular ? "text-[#D1FF00]" : "text-black/30"}>—</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.plan)}
                  className={`w-full py-4 font-mono text-[12px] font-bold uppercase tracking-[0.1em] border transition-colors duration-300 ${
                    plan.popular
                      ? "bg-[#D1FF00] text-black border-[#D1FF00] hover:bg-white hover:border-white"
                      : "bg-black text-white border-black hover:bg-[#D1FF00] hover:text-black hover:border-[#D1FF00]"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
