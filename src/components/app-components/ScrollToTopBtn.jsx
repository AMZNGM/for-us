"use client";

import { motion } from "motion/react";
import { useScrollPosition } from "@/hooks/useScrollPosition";

export default function ScrollToTopBtn() {
  const scroll100vh = useScrollPosition(1);

  return (
    <motion.button
      aria-label="Scroll to top"
      aria-controls="scroll-to-top"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: scroll100vh ? 1 : 0, y: 0 }}
      transition={{ type: "spring", duration: 0.2, stiffness: 100 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group w-10 h-10 fixed bottom-4 right-4 flex justify-center items-center rounded-xl shadow-lg bg-bg text-gold hover:text-bg hover:bg-gold transition-colors duration-300 cursor-pointer z-40 ${
        scroll100vh ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      ⬆︎
      <span className="absolute bottom-2.5 right-12 bg-gold text-bg text-sm rounded-full text-nowrap px-2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
        Scroll to top
      </span>
    </motion.button>
  );
}
