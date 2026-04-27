"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const plans = [
  {
    name: "STRATEGIST",
    price: 19,
    desc: "Advanced tools for serious seekers. 20 AI analyses & 10 auto-applications per month.",
  },
  {
    name: "ARCHITECT",
    price: 42,
    desc: "Unlimited access for professionals. Priority queue and infinite mock interviews.",
  },
];

export default function PricingSection() {
  const router = useRouter();
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".pricing-reveal", {
      opacity: 0,
      y: 60,
      duration: 1.5,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
      },
    });
  }, { scope: container });

  return (
    <section id="pricing" ref={container} className="scene-section items-end pb-32">
      <div className="w-full relative z-10 flex flex-col justify-end">
        <div className="pricing-reveal mb-24">
          <h2 className="leading-[1] text-[var(--text-primary)] font-bold font-sans tracking-tight" style={{ fontSize: "clamp(48px, 8vw, 120px)"}}>
            ACCESS THE<br/>
            INTELLIGENCE.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:w-2/3 ml-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className="pricing-reveal oryzo-panel flex flex-col"
            >
              <div className="flex items-center justify-between mb-16 border-b border-[var(--border-light)] pb-6">
                <h3 className="font-sans text-[24px] font-bold tracking-tight">{plan.name}</h3>
                <span className="font-sans text-[32px] font-medium tracking-tight">€{plan.price}</span>
              </div>
              <p className="font-sans text-[16px] text-[var(--text-secondary)] mb-12">
                {plan.desc}
              </p>
              <button 
                onClick={() => router.push(`/subscription/checkout?plan=${plan.name.toLowerCase()}&billing=month`)}
                className="mt-auto group flex items-center justify-between w-full border border-[var(--text-primary)] px-6 py-4 hover:bg-[var(--text-primary)] hover:text-[#0A0908] transition-colors duration-500"
              >
                <span className="oryzo-label group-hover:text-[#0A0908]">SELECT PROTOCOL</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
