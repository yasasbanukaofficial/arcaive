"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    title: "Velocity",
    description: "Reclaim hours of manual search and application effort through autonomous intelligence.",
  },
  {
    title: "Precision",
    description: "Hyper-tailored submissions that match role requirements with surgical accuracy.",
  },
  {
    title: "Preparation",
    description: "Stress-test your narrative against adversarial AI interviewer models.",
  },
  {
    title: "Insight",
    description: "Uncover hidden job market patterns through deep semantic analysis.",
  },
  {
    title: "Encryption",
    description: "Your professional vector data is secured with industrial-grade encryption standards.",
  },
  {
    title: "Synchronicity",
    description: "Always aligned with the latest market demands through real-time profile syncing.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="bg-[#FAF9F6] py-40 px-6 lg:px-12 relative border-b border-black/[0.03]">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col gap-8 mb-24">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">03 — Advantages</span>
          <h2 className="font-sans text-[48px] sm:text-[64px] font-medium leading-[1] tracking-tight text-black max-w-[700px]">
            Engineered for high-signal outcomes.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/[0.06]">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="p-16 border-r border-b border-black/[0.06] hover:bg-white transition-colors duration-500 group"
            >
              <span className="font-mono text-[11px] font-bold text-black/20 mb-8 block">(0{i+1})</span>
              <h4 className="font-sans text-[24px] font-medium text-black tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-500">
                {b.title}
              </h4>
              <p className="font-sans text-[16px] text-black/40 leading-relaxed max-w-[280px]">
                {b.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
