"use client";

import React, { useState } from "react";
import FAQItem from "./FAQItem";

const faqData = [
  {
    question: "What is this AI platform designed for?",
    answer:
      "It helps you generate, test, and deploy ideas with advanced AI models — all in one simple workspace.",
  },
  {
    question: "Do I need technical knowledge to use it?",
    answer:
      "No. Our interface is built for everyone. Whether you're a developer or a creative, you can leverage high-end AI without writing a single line of code.",
  },
  {
    question: "Which AI models power the tool?",
    answer:
      "We integrate with the latest state-of-the-art models including GPT-4o, Claude 3.5 Sonnet, and specialized open-source models to ensure the best output for every task.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes, we offer a generous free tier that allows you to explore our core features and get a feel for the platform's capabilities.",
  },
  {
    question: "Can I use this for business purposes?",
    answer:
      "Absolutely. Our Pro and Enterprise plans are specifically designed with commercial licensing, team collaboration tools, and enhanced security in mind.",
  },
  {
    question: "How can I get support if I have issues?",
    answer:
      "Our support team is available via live chat and email. Pro members get priority response times, while Enterprise customers have access to a dedicated account manager.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-32 px-6 lg:px-10 bg-black border-t border-white/[0.06]"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[#D1FF00] tracking-[0.15em]">[08]</span>
            <div className="w-12 h-[1px] bg-white/10" />
          </div>
          <h2 className="font-sans text-[36px] sm:text-[42px] font-bold leading-tight tracking-[-0.03em] text-white uppercase">
            Frequently<br />
            <span className="text-[#D1FF00]">asked.</span>
          </h2>
          <p className="font-sans text-[14px] text-white/30 leading-relaxed mt-2">
            Everything you need to know about ARCAIVE.
          </p>
        </div>

        <div className="lg:col-span-8 border-t border-white/[0.06]">
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
    </section>
  );
};

export default FAQSection;
