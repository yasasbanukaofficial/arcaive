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
      color: "hover:bg-blue-400/[0.03]",
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
      color: "bg-black",
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
      color: "hover:bg-purple-400/[0.03]",
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
      className="bg-white py-32 px-6 lg:px-12 relative overflow-hidden"
    >
      {/* Background soft glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24 max-w-[900px]"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="label-mono">06 — Pricing</span>
            </div>
            <h2 className="h2 tracking-tight text-black">
              Flexible pricing for every stage.
            </h2>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3 bg-off-white p-1.5 rounded-full border border-black/5">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full font-sans text-[13px] font-medium transition-all duration-300 ${
                !isYearly ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full font-sans text-[13px] font-medium transition-all duration-300 ${
                isYearly ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
              }`}
            >
              Annual -20%
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => {
            const displayPrice = typeof plan.price === "number"
              ? isYearly ? Math.floor(plan.price * 0.8) : plan.price
              : plan.price;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative p-10 lg:p-12 border rounded-[40px] flex flex-col transition-all duration-700 group hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular 
                    ? "bg-black text-white border-black shadow-xl" 
                    : "bg-[#FAF9F6] text-black border-black/10 " + plan.color
                }`}
              >
                {plan.popular && (
                  <div className="absolute -inset-[1px] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-[40px] -z-10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="mb-12">
                  <h4 className={`font-sans text-[14px] font-bold uppercase tracking-widest mb-8 ${
                    plan.popular ? "text-blue-400" : "text-black/40"
                  }`}>
                    {plan.plan}
                  </h4>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`font-sans text-[56px] lg:text-[72px] font-medium leading-none tracking-tight ${
                      plan.popular ? "text-white" : "text-black"
                    }`}>
                      {typeof plan.price === "number" && <span className="text-[0.6em] font-light opacity-40 mr-1">€</span>}
                      <AnimatePresence mode="wait">
                        <AnimatedPrice value={displayPrice} />
                      </AnimatePresence>
                    </span>
                    {typeof plan.price === "number" && (
                      <span className={`font-sans text-[14px] font-light ml-2 ${
                        plan.popular ? "text-white/40" : "text-black/40"
                      }`}>
                        /month
                      </span>
                    )}
                  </div>
                  <p className={`font-sans text-[15px] leading-relaxed ${
                    plan.popular ? "text-white/60" : "text-black/60"
                  }`}>
                    {plan.description}
                  </p>
                </div>

                <div className={`w-full h-[1px] mb-12 ${
                  plan.popular ? "bg-white/10" : "bg-black/5"
                }`} />

                <div className="flex-1">
                  <ul className="space-y-4 mb-14">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-4 font-sans text-[14px] ${
                          plan.popular ? "text-white/80" : "text-black/70"
                        }`}
                      >
                        <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          plan.popular ? "bg-white/5 border border-white/10" : "bg-black/[0.02] border border-black/5"
                        }`}>
                          <Check className={`w-2.5 h-2.5 ${plan.popular ? "text-white" : "text-black"}`} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.plan)}
                  className={`w-full rounded-full py-4 font-sans text-[15px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    plan.popular
                      ? "bg-white text-black hover:scale-105"
                      : "bg-black text-white hover:scale-105 shadow-md"
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
