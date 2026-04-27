"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    quote:
      "I've tested countless AI tools, but this one feels different — less like software, more like a guide that clears the fog in my career.",
    name: "Sophia M.",
    role: "Product Designer",
  },
  {
    id: 2,
    quote:
      "Within days, it streamlined my entire job search. The balance of precision and automation it offers is unlike anything I've seen.",
    name: "David K.",
    role: "Indie Hacker",
  },
  {
    id: 3,
    quote:
      "At first I was skeptical. But the clarity it brings into complex application processes feels almost like working with a second brain.",
    name: "Aria L.",
    role: "Researcher",
  },
  {
    id: 4,
    quote:
      "The seamless integration into my creative process has been a game changer. It doesn't replace me; it amplifies my reach.",
    name: "Marcus T.",
    role: "Art Director",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="section-cream py-32 px-6 lg:px-10 relative overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col gap-5 mb-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-black/30 tracking-[0.15em]">[03]</span>
            <div className="w-12 h-[1px] bg-black/10" />
            <span className="font-mono text-[11px] text-black/30 uppercase tracking-[0.15em]">
              Testimonials
            </span>
            <span className="font-mono text-[11px] text-black/15">_</span>
          </div>
          <h2 className="font-sans text-[36px] sm:text-[48px] font-bold leading-tight tracking-[-0.03em] text-black uppercase">
            Don&apos;t take our<br />
            word for it.
          </h2>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-black/10">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-10 sm:p-12 border-r border-b border-black/10 hover:bg-black/[0.02] transition-colors group"
            >
              <p className="font-sans text-[16px] sm:text-[18px] leading-[1.7] text-black/70 mb-10">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black flex items-center justify-center">
                  <span className="font-sans text-[14px] font-bold text-[#D1FF00]">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-sans text-[14px] font-bold text-black uppercase tracking-tight">
                    {t.name}
                  </p>
                  <p className="font-mono text-[10px] text-black/40 uppercase tracking-[0.15em]">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
