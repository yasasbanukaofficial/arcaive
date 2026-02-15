"use client";

import React from "react";
import { motion } from "framer-motion";

type Props = {
  value: React.ReactNode;
};

const AnimatedPrice = ({ value }: Props) => {
  return (
    <motion.span
      key={String(value)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="inline-block"
    >
      {value}
    </motion.span>
  );
};

export default AnimatedPrice;
