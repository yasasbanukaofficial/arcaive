"use client";

import { motion } from "framer-motion";
import React from "react";

type Props = {
  text: string;
  className?: string;
};

export default function UnfoldTextLetters({ text, className = "" }: Props) {
  const words = text.split(" ");
  let letterIndex = 0;

  return (
    <span
      className={`inline-flex flex-wrap justify-center gap-x-[0.25em] ${className}`.trim()}
    >
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.35,
                  delay: 0.5 + currentIndex * 0.012,
                  ease: [0.22, 1, 0.36, 1],
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
}
