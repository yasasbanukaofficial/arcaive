"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "€0",
    period: "/month",
    description: "Perfect to explore AI with essential tools for individuals and small projects.",
    cta: "Start for Free",
    features: ["Basic access to AI core", "Limited prompts per month", "Community support"],
    popular: false,
  },
  {
    name: "Pro",
    price: "€29",
    period: "/month",
    description: "Advanced features and flexibility to scale productivity and handle bigger workloads.",
    cta: "Upgrade to Pro",
    features: ["Unlimited AI prompts", "Priority response time", "Early access to new models"],
    popular: true,
  },
  {
    name: "Lifetime",
    price: "Custom",
    period: "",
    description: "Full power with custom options, priority support, and team-ready collaboration.",
    cta: "Contact Sales",
    features: ["Dedicated workspace", "Advanced model tuning", "Premium support & SLA"],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center mb-24">
           <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.4em] block mb-4">• Pricing Plans</span>
          <h2 className="text-[32px] md:text-[52px] font-medium tracking-[-0.03em] leading-[1.1] mb-8 text-white">
            Simple, transparent <span className="text-white/40">pricing.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
            Choose the plan that best fits your needs and start your journey with Message today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative p-10 rounded-[40px] border flex flex-col gap-10 transition-all duration-700 ${
                plan.popular 
                  ? "bg-white/[0.04] border-white/10 shadow-2xl z-10 scale-[1.02]" 
                  : "bg-white/[0.01] border-white/5"
              } hover:bg-white/[0.06] hover:border-white/10 group`}
            >
              <div className="space-y-4">
                <span className="text-[12px] font-bold text-white/30 uppercase tracking-[0.2em] block">{plan.name}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[52px] font-medium tracking-[-0.04em] text-white">{plan.price}</span>
                  <span className="text-white/30 text-sm font-bold uppercase tracking-widest">{plan.period}</span>
                </div>
                <p className="text-white/40 text-[15px] font-medium leading-relaxed min-h-[50px]">{plan.description}</p>
              </div>

              <button
                className={`w-full h-[52px] rounded-full font-bold text-[14px] transition-all duration-500 ${
                  plan.popular
                    ? "bg-white text-[#0f0f0f] hover:scale-[1.02] shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                } active:scale-95`}
              >
                {plan.cta}
              </button>

              <div className="space-y-5 pt-8 border-t border-white/5">
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                        <Check className="w-2.5 h-2.5 text-white/40" />
                      </div>
                      <span className="text-[14px] font-medium text-white/40 group-hover:text-white/60 transition-colors tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
