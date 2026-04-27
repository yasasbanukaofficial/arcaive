"use client";

import React, { useState } from "react";
import FAQItem from "./FAQItem";
import { motion } from "framer-motion";

const faqData = [
  {
    question: "What is the Intelligence Swarm?",
    answer: "Our Intelligence Swarm consists of three specialized AI agents that work in parallel to deconstruct, synchronize, and optimize your professional narrative for the modern job market.",
  },
  {
    question: "Do I need to be a technical expert?",
    answer: "No. Arcaive is designed to handle the complexity for you. Our interface is as intuitive as a high-end publication, allowing you to focus on your career strategy.",
  },
  {
    question: "How does the auto-apply system work?",
    answer: "Once you approve a target role, our agents autonomously handle the submission process—including hyper-tailored resume generation and form completion—with 99% accuracy.",
  },
  {
    question: "Is my data secure?",
    answer: "Security is built into our core. Every piece of your professional data is encrypted and stored in a private vector database, used only for your specific career optimizations.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-transparent py-40 px-6 lg:px-12 relative border-b border-white/5 overflow-hidden">
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 mb-8 block">06 — Clarity</span>
              <h2 className="font-sans text-[48px] font-medium leading-[1] tracking-tight text-white max-w-[400px]">
                Seeking understanding.
              </h2>
            </motion.div>
            <p className="font-sans text-[18px] text-white/30 leading-relaxed max-w-[320px] font-light italic">
              Every question answered, ensuring total transparency in our automated processes.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col border-t border-white/10">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
