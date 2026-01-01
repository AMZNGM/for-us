"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="fixed md:left-5 md:top-1/2 md:-translate-y-1/2 bg-main rounded-xl shadow-2xl p-4.5 z-10 max-md:bottom-4 max-md:left-1/2 max-md:-translate-x-1/2 max-md:rotate-90">
      <div className="relative w-1 h-32 bg-bg/25 rounded-full">
        <motion.div
          className="absolute top-0 left-0 w-full bg-bg rounded-full"
          style={{ height }}
        />
      </div>
    </section>
  );
}
