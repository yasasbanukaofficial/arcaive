import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

export const dashboardStagger = (
  staggerDelay: number = 0.08,
  initialDelay: number = 0.1,
): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "tween", duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const barGrow: Variants = {
  hidden: { scaleY: 0, originY: 1 },
  show: {
    scaleY: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

export const pulseGlow: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: [0.5, 1, 0.5],
    scale: [0.95, 1.05, 0.95],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

export const sidebarVariants: Variants = {
  collapsed: { width: 72 },
  expanded: { width: 260 },
};
