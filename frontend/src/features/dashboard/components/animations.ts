import type { Variants } from "framer-motion";

// Smoother easing curve — fast deceleration for a "snappy but smooth" feel
const smoothEase = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8, willChange: "opacity, transform" },
  show: {
    opacity: 1,
    y: 0,
    willChange: "auto",
    transition: { type: "tween", duration: 0.3, ease: smoothEase },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -6, willChange: "opacity, transform" },
  show: {
    opacity: 1,
    x: 0,
    willChange: "auto",
    transition: { type: "tween", duration: 0.25, ease: smoothEase },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97, willChange: "opacity, transform" },
  show: {
    opacity: 1,
    scale: 1,
    willChange: "auto",
    transition: { type: "tween", duration: 0.25, ease: smoothEase },
  },
};

export const dashboardStagger = (
  staggerDelay: number = 0.04,
  initialDelay: number = 0.02,
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
  hidden: { opacity: 0, x: 10, willChange: "opacity, transform" },
  show: {
    opacity: 1,
    x: 0,
    willChange: "auto",
    transition: { type: "tween", duration: 0.3, ease: smoothEase },
  },
};

export const barGrow: Variants = {
  hidden: { scaleY: 0, originY: 1, willChange: "transform" },
  show: {
    scaleY: 1,
    willChange: "auto",
    transition: { type: "tween", duration: 0.4, ease: smoothEase },
  },
};

export const pulseGlow: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: [0.6, 1, 0.6],
    scale: [0.97, 1.03, 0.97],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export const sidebarVariants: Variants = {
  collapsed: { width: 72 },
  expanded: { width: 260 },
};
