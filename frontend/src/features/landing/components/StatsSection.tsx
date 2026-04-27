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
        duration: 2.5,
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
      <span ref={nodeRef} className="font-sans text-[64px] md:text-[110px] font-medium leading-none tracking-[-0.07em] text-white">0</span>
      <span className="font-sans text-[24px] md:text-[32px] font-light text-white/20 ml-2 tracking-widest">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-transparent py-40 px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12"
        >
          <div className="max-w-[600px]">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 mb-8 block">THE METRICS</span>
            <h2 className="font-sans text-[48px] font-medium leading-[1] tracking-tight text-white">
              Validation through <br />
              <span className="text-white/20 italic text-[42px]">uncontested output.</span>
            </h2>
          </div>
          <p className="font-sans text-[18px] text-white/30 max-w-[350px] leading-relaxed font-light italic">
            Every application processed by Arcaive is tracked with forensic detail to continuously evolve our search patterns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col py-16 pr-8 ${i !== stats.length - 1 ? "lg:border-r border-white/10" : ""} ${i === 0 ? "" : "lg:pl-12"}`}
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-white/30 mt-10 font-bold">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Scanline */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 overflow-hidden">
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </div>
    </section>
  );
}
