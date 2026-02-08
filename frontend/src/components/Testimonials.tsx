"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    quote: "Message has completely transformed how I approach my daily research. It's like having a second brain that never sleeps.",
    author: "Sarah Jenkins",
    role: "Research Scientist",
  },
  {
    quote: "The speed and clarity of the writing assistance is unmatched. I've saved hours on my newsletter drafts.",
    author: "David Chen",
    role: "Content Creator",
  },
  {
    quote: "Intuitive, minimal, and powerful. It doesn't get in your way; it just helps you do better work.",
    author: "Elena Rodriguez",
    role: "Product Designer",
  },
  {
    quote: "Finally an AI tool that feels premium and thoughtful. The user experience is just on another level.",
    author: "James Wilson",
    role: "Tech Lead",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto mb-20">
        <div className="max-w-4xl">
           <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.4em] block mb-4">• Social Proof</span>
          <h2 className="text-[32px] md:text-[52px] font-medium tracking-[-0.03em] leading-[1.1] text-white">
            Loved by thinkers. <br />
            <span className="text-white/40">Trusted by creators.</span>
          </h2>
        </div>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="w-[380px] md:w-[480px] bg-white/[0.01] border border-white/5 p-10 md:p-12 rounded-[40px] flex flex-col justify-between gap-12 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-700 group"
            >
              <p className="text-lg md:text-[24px] font-medium leading-[1.3] text-white whitespace-normal tracking-tight">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-white/5 overflow-hidden relative border border-white/5 group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.author.replace(/ /g, "%20")}`}
                    alt={t.author}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-base font-bold text-white tracking-tight">{t.author}</h4>
                  <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.1em]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Gradients to fade out edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
      </div>
    </section>
  );
}
