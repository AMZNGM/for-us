"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import GlobalModal from "@/components/ui/GlobalModal";

const images = Array.from(
  { length: 55 },
  (_, i) => `/images/yassirita/yassirita-${i + 1}.webp`
);

const champImages = Array.from(
  { length: 33 },
  (_, i) => `/images/yassirita/champ/champ-${i + 1}.webp`
);

export function ParallaxImageGrid() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <>
      <h2 className="relative font-ter text-7xl text-main text-center z-20">
        Pequeña Yassirita
      </h2>

      <section className="relative w-full min-h-screen overflow-hidden py-32">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 sm:px-8">
          {images.map((src, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="relative aspect-3/4 rounded-2xl overflow-hidden will-change-transform cursor-pointer"
                onClick={() => setActiveImage(src)}
              >
                <Image
                  src={src}
                  alt={`yassirita-${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw,
                         (max-width: 1024px) 33vw,
                         20vw"
                  className="object-cover select-none"
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      <GlobalModal activeImage={activeImage} setActiveImage={setActiveImage} />
    </>
  );
}

export function ParallaxChampImageGrid() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <>
      <h2 className="relative font-ter text-7xl text-main text-center z-20">
        Campeona Yassirita
      </h2>

      <section className="relative w-full min-h-screen overflow-hidden py-32">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 sm:px-8">
          {champImages.map((src, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="relative aspect-3/4 rounded-2xl overflow-hidden will-change-transform cursor-pointer"
                onClick={() => setActiveImage(src)}
              >
                <Image
                  src={src}
                  alt={`champ-yassirita-${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw,
                         (max-width: 1024px) 33vw,
                         20vw"
                  className="object-cover select-none"
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      <GlobalModal activeImage={activeImage} setActiveImage={setActiveImage} />
    </>
  );
}
