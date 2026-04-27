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
      className="py-32 px-6 lg:px-12 bg-white"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="label-mono">07 — FAQ</span>
          </div>
          <h2 className="h2 tracking-tight text-black">
            Frequently asked questions.
          </h2>
          <p className="font-sans text-[16px] text-black/50 leading-[1.6]">
            Everything you need to know about Arcaive.
          </p>
        </div>

        <div className="lg:col-span-7 border-t border-black/10">
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
