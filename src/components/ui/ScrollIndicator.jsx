"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useIsScrollable } from "@/hooks/useisScrollable";

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scrollHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const isScrollable = useIsScrollable();
  if (!isScrollable) return null;

  return (
    <section className="fixed md:left-5 md:top-1/2 md:-translate-y-1/2 bg-main rounded-xl shadow-2xl p-3 z-10 max-md:bottom-4 max-md:left-1/2 max-md:-translate-x-1/2 max-md:rotate-90">
      <div className="relative w-1 h-32 bg-bg/25 rounded-full">
        <motion.div
          className="absolute top-0 left-0 w-full bg-bg rounded-full"
          style={{ height: scrollHeight }}
        />
      </div>
    </section>
  );
}
