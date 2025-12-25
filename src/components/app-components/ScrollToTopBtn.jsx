"use client";

import { ChevronUp } from "lucide-react";
import { motion } from "motion/react";

export default function ScrollToTopBtn() {
  return (
    <motion.button
      aria-label="Scroll to top"
      aria-controls="scroll-to-top"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.2, stiffness: 100 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group w-10 h-10 fixed bottom-4 right-4 flex justify-center items-center rounded-full shadow-lg bg-bg text-main hover:text-bg hover:bg-main transition-colors duration-300 cursor-pointer z-40"
    >
      <ChevronUp size={20} />

      <span className="absolute bottom-2.5 right-12 bg-main text-bg text-sm rounded-full text-nowrap px-2 opacity-0 group-hover:opacity-75 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
        Scroll to top
      </span>
    </motion.button>
  );
}
