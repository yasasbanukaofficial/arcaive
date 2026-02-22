"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
};

const FAQItem = ({ question, answer, isOpen, onClick }: Props) => {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        className="w-full py-4 sm:py-5 md:py-6 flex items-center justify-between text-left group transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] sm:text-lg md:text-xl font-light text-white/90 group-hover:text-white transition-colors tracking-tight pr-2">
          {question}
        </span>
        <div className="ml-3 sm:ml-4 flex-shrink-0 text-gray-500 group-hover:text-white transition-colors">
          {isOpen ? (
            <X size={18} strokeWidth={1.5} className="sm:hidden" />
          ) : (
            <Plus size={18} strokeWidth={1.5} className="sm:hidden" />
          )}
          {isOpen ? (
            <X size={20} strokeWidth={1.5} className="hidden sm:block" />
          ) : (
            <Plus size={20} strokeWidth={1.5} className="hidden sm:block" />
          )}
        </div>
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
            <div className="pb-5 sm:pb-6 md:pb-8 text-gray-400 leading-relaxed text-[13px] sm:text-sm md:text-base max-w-2xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQItem;
