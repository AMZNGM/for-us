"use client";

import Image from "next/image";
import { motion } from "motion/react";
import TextAnimation from "@/components/ui/text/TextAnimation";

export default function Logo({ welcome = "show" }) {
  welcome = welcome === "show" ? "show" : "hidden!";

  return (
    <>
      <TextAnimation
        text="Welcome To"
        duration={1}
        className={`text-4xl max-md:text-3xl text-center font-sec ${welcome}`}
      />

      <motion.section
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        className="relative cursor-grab active:cursor-grabbing"
      >
        <TextAnimation
          text="For"
          duration={1}
          delay={0.3}
          className="relative text-8xl max-md:text-6xl text-center font-sec p-4 pe-0"
        />
        <TextAnimation
          text="Us <3"
          duration={1}
          delay={0.5}
          className="relative text-8xl max-md:text-6xl text-center font-sec p-4 z-10"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        >
          <Image
            src="/images/yassirita-drink-mate-no-bg.webp"
            alt="background"
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="relative object-contain pointer-events-none -translate-x-6 -translate-y-8 scale-125"
          />
        </motion.div>
      </motion.section>
    </>
  );
}
