"use client";

import React, { useState } from "react";
import FAQItem from "./FAQItem";
import SectionHeader from "@/components/layout/SectionHeader";

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
      "Our support team is available via live chat and email. Pro users get priority response times, while Enterprise customers have access to a dedicated account manager.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-20">
          <SectionHeader
            label="FAQ"
            title="Your questions,"
            subtitle="answered with clarity"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0 items-start">
          <div className="flex flex-col">
            {faqData.slice(0, 3).map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>

          <div className="flex flex-col">
            {faqData.slice(3).map((item, index) => {
              const actualIndex = index + 3;
              return (
                <FAQItem
                  key={actualIndex}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === actualIndex}
                  onClick={() =>
                    setOpenIndex(openIndex === actualIndex ? -1 : actualIndex)
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
