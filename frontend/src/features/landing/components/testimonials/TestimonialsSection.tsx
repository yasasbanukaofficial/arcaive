"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "I've tested countless AI tools, but this one feels different — less like software, more like a guide that clears the fog in my career.",
    author: "Sophia M.",
    position: "Product Designer @ Linear",
  },
  {
    quote: "Within days, it streamlined my entire job search. The balance of precision and automation it offers is unlike anything I've seen.",
    author: "David K.",
    position: "Engineering Director",
  },
  {
    quote: "The clarity it brings into complex application processes feels almost like working with a second brain. Surgical precision.",
    author: "Aria L.",
    position: "Senior Researcher @ OpenAI",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-transparent py-40 px-6 lg:px-12 relative border-b border-[var(--border-light)] overflow-hidden">
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="flex flex-col gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <span className="oryzo-label text-[var(--text-secondary)]">03 — Stories</span>
            <h2 className="font-sans text-[48px] sm:text-[64px] font-bold leading-[1] tracking-tight text-[var(--text-primary)] max-w-[800px]">
              Voices from the frontier of automated careers.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative oryzo-panel p-12 sm:p-20 rounded-[48px] shadow-2xl"
              >
                <p className="font-sans text-[32px] sm:text-[42px] font-medium leading-[1.3] tracking-tight text-[var(--text-primary)] relative z-10">
                  <span className="text-[var(--text-secondary)] mr-4 italic">"</span>
                  {testimonials[0].quote}
                </p>
                <div className="mt-16 flex flex-col gap-2">
                  <span className="font-sans text-[20px] font-bold text-[var(--text-primary)] italic">{testimonials[0].author}</span>
                  <span className="oryzo-label text-[var(--text-secondary)]">{testimonials[0].position}</span>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-16">
              {testimonials.slice(1).map((t, i) => (
                <motion.div
                  key={t.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                  className="flex flex-col gap-8 border-l border-[var(--border-light)] pl-10"
                >
                  <p className="font-sans text-[18px] text-[var(--text-secondary)] leading-relaxed italic font-light">
                    "{t.quote}"
                  </p>
                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[14px] font-bold text-[var(--text-primary)] tracking-widest">{t.author}</span>
                    <span className="font-sans text-[12px] text-[var(--text-secondary)] uppercase tracking-[0.3em] font-bold">{t.position}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
