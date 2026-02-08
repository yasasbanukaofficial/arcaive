"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does Message prioritize my privacy?",
    answer: "We use end-to-end encryption and never store your personal data or use it to train our base models. Your security is our top priority.",
  },
  {
    question: "Can I use Message offline?",
    answer: "Currently, Message requires an internet connection to access our real-time AI capabilities, but we are exploring local execution for basic tasks.",
  },
  {
    question: "Does Message support multiple languages?",
    answer: "Yes, Message fluently supports over 50 languages, providing natural translations and culturally aware insights.",
  },
  {
    question: "How do the credits work in the Starter plan?",
    answer: "Each 'prompt' consumes one credit. The Starter plan provides 100 credits per month, reset on each billing cycle.",
  },
  {
    question: "Is there a team or enterprise version?",
    answer: "Absolutely! Our Lifetime/Custom plan offers team workspace tools, centralized billing, and advanced security features.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 px-6 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-20">
          <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.4em] block mb-4">• FAQ</span>
          <h2 className="text-[32px] md:text-[52px] font-medium tracking-[-0.03em] leading-[1.1] text-white">
            Your questions, <br />
            <span className="text-white/40">answered with clarity.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className={`rounded-[24px] overflow-hidden transition-all duration-500 border ${
                  isOpen ? "bg-white/[0.04] border-white/10" : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 md:p-8 text-left flex items-center justify-between transition-colors group"
                >
                  <span className={`text-lg md:text-xl font-medium tracking-tight transition-all duration-500 ${isOpen ? "text-white" : "text-white/50 group-hover:text-white"}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? "bg-white border-white scale-110" : "bg-white/5 border-white/10"}`}>
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-black" />
                    ) : (
                      <Plus className="w-4 h-4 text-white/30" />
                    )}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-8 pb-8 md:px-10 md:pb-10 text-white/40 text-[16px] md:text-lg font-medium leading-relaxed max-w-2xl">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
