import type { Variants } from "framer-motion";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export const bounceIn: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    willChange: "opacity, transform",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    willChange: "auto",
    transition: {
      type: "tween",
      duration: 0.25,
      ease: smoothEase,
    },
  },
};

export const staggerContainer = (
  staggerDelay: number = 0.06,
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

export const item: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    willChange: "opacity, transform",
  },
  show: {
    opacity: 1,
    y: 0,
    willChange: "auto",
    transition: {
      type: "tween",
      duration: 0.2,
      ease: smoothEase,
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
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export default { item, container, bounceIn, staggerContainer };
