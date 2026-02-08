"use client";

import { motion } from "framer-motion";
import React from "react";

type Props = {
  text: string;
  className?: string;
};

export default function UnfoldText({ text, className = "" }: Props) {
  const words = text.split(" ");

  return (
    <span
      className={`inline-flex flex-wrap justify-center gap-x-[0.2em] overflow-visible ${className}`.trim()}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden py-[0.06em] -my-[0.06em]"
        >
          <motion.span
            initial={{ opacity: 0, filter: "blur(6px)", y: "100%" }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.9,
              delay: i * 0.06,
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
}
