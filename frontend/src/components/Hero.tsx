"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const UnfoldText = ({ text }: { text: string }) => {
  const words = text.split(" ");

  return (
    <span className="inline-flex flex-wrap justify-center gap-x-[0.2em] overflow-visible">
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden py-[0.1em] -my-[0.1em]"
        >
          <motion.span
            initial={{ opacity: 0, filter: "blur(8px)", y: "100%" }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 1,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const UnfoldTextLetters = ({ text }: { text: string }) => {
  const words = text.split(" ");
  let letterIndex = 0;

  return (
    <span className="inline-flex flex-wrap justify-center gap-x-[0.25em]">
      {words.map((word, wordIdx) => (
        <span
          key={wordIdx}
          className="inline-flex"
          style={{ whiteSpace: "nowrap" }}
        >
          {word.split("").map((letter, letterIdx) => {
            const currentIndex = letterIndex++;
            return (
              <motion.span
                key={letterIdx}
                initial={{ opacity: 0, filter: "blur(8px)", transform: "none" }}
                animate={{ opacity: 1, filter: "blur(0px)", transform: "none" }}
                transition={{
                  duration: 0.8,
                  delay: 1.2 + currentIndex * 0.02,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y: backgroundY, opacity: 1, willChange: "transform" }}
        className="absolute inset-0 z-0"
      >
        {/* Image Container (full-bleed, no dark overlay) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <Image
              decoding="auto"
              width="2912"
              height="1632"
              sizes="100vw"
              src="/images/lg-bg.png"
              alt="bg-img-inteview"
              unoptimized
              className="block w-[100vw] h-[100vh] object-cover object-center"
              style={{ display: "block", width: "100vw", height: "100vh" }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-[1200px] px-6 mx-auto flex flex-col items-center gap-16">
        <div className="space-y-6">
          <h1 className="text-[48px] md:text-[88px] font-bold tracking-[-0.04em] leading-[1] text-white">
            <UnfoldText text="Where thoughts become actions." />
          </h1>

          <p className="text-lg md:text-xl text-white font-medium max-w-2xl mx-auto leading-relaxed tracking-tight">
            <UnfoldTextLetters text="An AI companion that whispers clarity, conjures ideas, and guides your every move." />
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/journey"
            className="inline-flex items-center justify-center bg-[rgb(213,255,69)] text-[#0f0f0f] px-10 py-4 h-[52px] rounded-full font-bold text-base hover:scale-[1.03] transition-all active:scale-95 shadow-[0_0_0_0_rgba(213,255,69,0.2)] border-2 border-white/20 group"
          >
            Begin Journey
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="flex flex-col items-center gap-3 mt-8"
        >
          <svg
            className="w-6 h-6 text-white/30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5v14m0 0l-7-7m7 7l7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  );
}
