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
    <div className="border-b border-[var(--border-light)]">
      <button
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between text-left group transition-colors"
        aria-expanded={isOpen}
      >
        <span className={`font-sans text-[18px] font-medium tracking-tight pr-4 transition-colors ${
          isOpen ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
        }`}>
          {question}
        </span>
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[var(--border-light)] flex items-center justify-center transition-all group-hover:border-[var(--text-primary)] group-hover:scale-110">
          <span className={`font-sans text-[18px] transition-transform duration-500 ${
            isOpen ? "rotate-45 text-[var(--text-primary)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
          }`}>
            +
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 font-sans text-[15px] font-light text-[var(--text-secondary)] leading-[1.6] max-w-2xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQItem;
