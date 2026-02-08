"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "Time Unfolded",
    description: "Automate tasks and reclaim hours, your AI assistant turns routine into seconds so you can focus on growth.",
    image: "/images/hero-bg.png",
  },
  {
    title: "Words That Flow",
    description: "Drafts, blogs, and emails written with clarity and speed — the elegance of language without the struggle.",
    image: "/images/hero-bg.png",
  },
  {
    title: "A Silent Guide",
    description: "Always present to keep you focused — suggestions, reminders, and insights right when you need them.",
    image: "/images/hero-bg.png",
  },
];

export default function Features() {
  return (
    <section id="features" className="pt-32 pb-16 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-20">
          <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-4">• Introducing Message</span>
          <h2 className="text-[32px] md:text-[52px] font-medium tracking-[-0.03em] leading-[1.1] max-w-3xl text-white">
            Harness invisible power <span className="text-white/40">to write faster, focus deeper, and save hours.</span>
          </h2>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="group relative bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-[#111]">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700 scale-105 group-hover:scale-110"
                />
              </div>
              <div className="p-8 md:p-10">
                <h3 className="text-xl md:text-2xl font-medium mb-3 text-white tracking-tight">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed text-[15px] font-medium">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
