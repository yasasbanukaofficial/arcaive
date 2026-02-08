"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/layout/SectionHeader";
import { Plus, Minus } from "lucide-react";
import { container, item } from "@/components/animations/variants";

const faqs = [
  {
    question: "How does Message prioritize my privacy?",
    answer:
      "We use end-to-end encryption and never store your personal data or use it to train our base models. Your security is our top priority.",
  },
  {
    question: "Can I use Message offline?",
    answer:
      "Currently, Message requires an internet connection to access our real-time AI capabilities, but we are exploring local execution for basic tasks.",
  },
  {
    question: "Does Message support multiple languages?",
    answer:
      "Yes, Message fluently supports over 50 languages, providing natural translations and culturally aware insights.",
  },
  {
    question: "How do the credits work in the Starter plan?",
    answer:
      "Each 'prompt' consumes one credit. The Starter plan provides 100 credits per month, reset on each billing cycle.",
  },
  {
    question: "Is there a team or enterprise version?",
    answer:
      "Absolutely! Our Lifetime/Custom plan offers team workspace tools, centralized billing, and advanced security features.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-32 px-6 border-t border-white/5 bg-[#0a0a0a]"
    >
      <div className="max-w-[800px] mx-auto">
        <SectionHeader
          tag={"• FAQ"}
          title={"Your questions, "}
          subtitle={"answered with clarity."}
          tagTracking={"tracking-[0.4em]"}
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={container}
          className="grid grid-cols-1 gap-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                variants={item}
                className={`rounded-[24px] overflow-hidden transition-all duration-500 border ${
                  isOpen
                    ? "bg-white/[0.04] border-white/10"
                    : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 md:p-8 text-left flex items-center justify-between transition-colors group"
                >
                  <span
                    className={`text-lg md:text-xl font-medium tracking-tight transition-all duration-500 ${isOpen ? "text-white" : "text-white/50 group-hover:text-white"}`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? "bg-white border-white scale-110" : "bg-white/5 border-white/10"}`}
                  >
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
        </motion.div>
      </div>
    </section>
  );
}
