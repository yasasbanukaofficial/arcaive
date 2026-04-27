"use client";

import { motion, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: 98, suffix: "%", label: "Success Rate" },
  { value: 14, suffix: "k", label: "Automated Apps" },
  { value: 48, suffix: "h", label: "Time to Interview" },
  { value: 3.2, suffix: "x", label: "Salary Increase" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const node = nodeRef.current;
      if (!node) return;
      const controls = animate(0, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(v) {
          node.textContent = v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
        },
      });
      return () => controls.stop();
    }
  }, [value, isInView]);

  return (
    <span className="flex items-baseline">
      <span ref={nodeRef} className="font-sans text-[64px] md:text-[96px] font-medium leading-none tracking-[-0.05em] text-black">0</span>
      <span className="font-sans text-[24px] md:text-[32px] font-light text-black/20 ml-2">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-white pt-12 md:pt-16 pb-40 px-6 lg:px-12 relative overflow-hidden border-b border-black/[0.03]">
      <div className="max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8"
        >
          <div className="max-w-[500px]">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30 mb-6 block">02 — The impact</span>
            <h2 className="font-sans text-[32px] font-medium leading-tight tracking-tight text-black">
              Measured by real outcomes, driven by surgical AI precision.
            </h2>
          </div>
          <p className="font-sans text-[16px] text-black/40 max-w-[320px] leading-relaxed">
            We track every interaction, every application, and every successful hire to continuously refine our swarm algorithms.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-black/[0.06]">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col py-16 pr-8 ${i !== stats.length - 1 ? "border-r border-black/[0.06]" : ""} ${i === 0 ? "" : "pl-8"}`}
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-black/40 mt-8 font-bold">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
