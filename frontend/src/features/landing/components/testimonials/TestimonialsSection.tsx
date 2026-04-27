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
    <section id="testimonials" className="bg-[#FAF9F6] py-40 px-6 lg:px-12 relative border-b border-black/[0.03]">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col gap-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">03 — Stories</span>
            <h2 className="font-sans text-[48px] sm:text-[64px] font-medium leading-[1] tracking-[-0.04em] text-black max-w-[800px]">
              Voices from the frontier of automated careers.
            </h2>
          </motion.div>

          {/* Main Testimonial */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <span className="text-[120px] font-serif text-black/5 absolute -top-20 -left-10 select-none">"</span>
                <p className="font-sans text-[32px] sm:text-[42px] font-medium leading-[1.3] tracking-tight text-black relative z-10">
                  {testimonials[0].quote}
                </p>
                <div className="mt-12 flex flex-col gap-1">
                  <span className="font-sans text-[18px] font-bold text-black">{testimonials[0].author}</span>
                  <span className="font-sans text-[14px] text-black/40 uppercase tracking-widest">{testimonials[0].position}</span>
                </div>
              </motion.div>
            </div>

            {/* List of others */}
            <div className="lg:col-span-4 flex flex-col gap-16">
              {testimonials.slice(1).map((t, i) => (
                <motion.div
                  key={t.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + (i * 0.1) }}
                  className="flex flex-col gap-6 border-l border-black/[0.08] pl-10"
                >
                  <p className="font-sans text-[18px] text-black/60 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div className="flex flex-col">
                    <span className="font-sans text-[14px] font-bold text-black">{t.author}</span>
                    <span className="font-sans text-[12px] text-black/30 uppercase tracking-widest leading-loose">{t.position}</span>
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
