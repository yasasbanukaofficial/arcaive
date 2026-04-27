"use client";

import { motion, useSpring, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: 98, suffix: "%", label: "Success Rate", color: "bg-orange-400/10" },
  { value: 14, suffix: "k", label: "Automated Apps", color: "bg-blue-400/10" },
  { value: 48, suffix: "h", label: "Time to Interview", color: "bg-green-400/10" },
  { value: 3.2, suffix: "x", label: "Salary Increase", color: "bg-purple-400/10" },
];

function Counter({ value, suffix }: { value: number, suffix: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const node = nodeRef.current;
      if (!node) return;

      const controls = animate(0, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(value) {
          node.textContent = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
        },
      });

      return () => controls.stop();
    }
  }, [value, isInView]);

  return (
    <span className="flex items-baseline">
      <span ref={nodeRef} className="font-sans text-[56px] md:text-[80px] font-light leading-none tracking-[-0.04em] text-black">0</span>
      <span className="font-sans text-[32px] md:text-[40px] font-light text-black/30 ml-1">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-[#FAF9F6] py-32 px-6 lg:px-12 relative overflow-hidden border-t border-b border-black/5">
      {/* Background soft glows */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col items-center justify-center py-10 px-6 group transition-all duration-500 ${
                i !== stats.length - 1 ? "md:border-r border-black/5" : ""
              } ${i % 2 === 0 && i < stats.length - 1 ? "border-r border-black/5 md:border-r-0 md:border-transparent" : "border-0"}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${stat.color} blur-3xl`} />
              
              <div className="relative z-10 flex flex-col items-center">
                <Counter value={stat.value} suffix={stat.suffix} />
                <span className="font-sans text-[12px] uppercase tracking-[0.1em] text-black/40 mt-6 text-center font-medium group-hover:text-black/60 transition-colors">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
