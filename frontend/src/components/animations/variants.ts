import type { Variants } from "framer-motion";

// Bounce-in animation for individual items
export const bounceIn: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

// Container that staggers children with custom delay
export const staggerContainer = (
  staggerDelay: number = 0.1,
  initialDelay: number = 0,
): Variants => ({
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

// Legacy support - keeping old variants for backward compatibility
export const item: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const container: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export default { item, container, bounceIn, staggerContainer };
