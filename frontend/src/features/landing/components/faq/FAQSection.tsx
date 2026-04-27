"use client";

import React, { useState, useRef } from "react";
import FAQItem from "./FAQItem";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const faqData = [
  {
    question: "What is the Intelligence Swarm?",
    answer: "Our Intelligence Swarm consists of three specialized AI agents that work in parallel to deconstruct, synchronize, and optimize your professional narrative for the modern job market.",
  },
  {
    question: "Do I need to be a technical expert?",
    answer: "No. Arcaive is designed to handle the complexity for you. Our interface is minimal and declarative, allowing you to focus on your career strategy while we manage the execution.",
  },
  {
    question: "How does the auto-apply system work?",
    answer: "Once you approve a target role, our agents autonomously handle the submission process—including hyper-tailored resume generation and form completion—with precision tracking.",
  },
  {
    question: "Is my data secure?",
    answer: "Security is built into our core. Every piece of your professional data is encrypted and stored in an isolated vector database, used exclusively for your personal career optimizations.",
  },
];

export default function FAQSection() {
  const container = useRef(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useGSAP(() => {
    gsap.from(".faq-reveal", {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
      },
    });
  }, { scope: container });

  return (
    <section id="faq" ref={container} className="scene-container py-32 px-6 lg:px-12 border-b border-white/[0.06]">
      <div className="content-wrapper w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5 flex flex-col gap-8 faq-reveal">
            <div>
              <span className="section-label mb-6 block">Knowledge Base</span>
              <h2 className="font-sans text-[clamp(36px,5vw,56px)] font-medium leading-[1] tracking-[-0.04em] text-white max-w-[400px]">
                Seeking <br/><span className="italic text-white/40 font-light">understanding.</span>
              </h2>
            </div>
            <p className="font-sans text-[16px] text-white/30 leading-relaxed max-w-[320px] font-light">
              We operate with absolute transparency. Every mechanism and protocol is fully documented below.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col border-t border-white/[0.06]">
            {faqData.map((item, index) => (
              <div key={index} className="faq-reveal">
                <FAQItem
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
