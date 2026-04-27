"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
};

const FAQItem = ({ question, answer, isOpen, onClick }: Props) => {
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between text-left group transition-colors"
        aria-expanded={isOpen}
      >
        <span className={`font-sans text-[16px] font-bold uppercase tracking-tight pr-2 transition-colors ${
          isOpen ? "text-[#D1FF00]" : "text-white"
        }`}>
          {question}
        </span>
        <span className={`font-mono text-[24px] transition-colors ${
          isOpen ? "text-[#D1FF00]" : "text-white/30"
        }`}>
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 font-sans text-[14px] text-white/40 leading-relaxed max-w-2xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQItem;
