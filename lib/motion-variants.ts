import type { Variants } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } },
};

export const stagger = (children = 0.06, delay = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: children, delayChildren: delay },
  },
});

export const lineWipe: Variants = {
  hidden: { scaleX: 0, transformOrigin: "left center" },
  visible: { scaleX: 1, transition: { duration: 1, ease } },
};
