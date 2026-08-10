"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
};

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  as = "div",
}: AnimatedSectionProps) {
  const MotionTag = as === "section" ? motion.section : motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
}
