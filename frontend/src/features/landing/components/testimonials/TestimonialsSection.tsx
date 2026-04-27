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
    color: "group-hover:bg-[#e0d6f5]/20",
  },
  {
    id: 2,
    quote:
      "Within days, it streamlined my entire job search. The balance of precision and automation it offers is unlike anything I've seen.",
    name: "David K.",
    role: "Indie Hacker",
    color: "group-hover:bg-[#c3e6f0]/20",
  },
  {
    id: 3,
    quote:
      "At first I was skeptical. But the clarity it brings into complex application processes feels almost like working with a second brain.",
    name: "Aria L.",
    role: "Researcher",
    color: "group-hover:bg-[#f9dbbd]/20",
  },
  {
    id: 4,
    quote:
      "The seamless integration into my creative process has been a game changer. It doesn't replace me; it amplifies my reach.",
    name: "Marcus T.",
    role: "Art Director",
    color: "group-hover:bg-[#f0e4c3]/20",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="bg-[#FAF9F6] py-32 px-6 lg:px-12 relative overflow-hidden border-t border-b border-black/5"
    >
      {/* Background soft glows */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-200/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 mb-24 max-w-[800px]"
        >
          <div className="flex items-center gap-3">
            <span className="label-mono">05 — Testimonials</span>
          </div>
          <h2 className="h2 tracking-tight text-black">
            Don't take our word for it.
          </h2>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-black/5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`p-12 sm:p-16 border-r border-b border-black/10 transition-all duration-700 cursor-default group relative overflow-hidden ${t.color}`}
            >
              <div className="relative z-10">
                <p className="font-sans text-[20px] sm:text-[24px] font-medium leading-[1.5] text-black mb-16 tracking-tight">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full border border-black/10 bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <span className="font-sans text-[18px] font-medium text-black">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-sans text-[16px] font-medium text-black tracking-tight">
                      {t.name}
                    </p>
                    <p className="font-sans text-[14px] font-light text-black/40">
                      {t.role}
                    </p>
                  </div>
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
