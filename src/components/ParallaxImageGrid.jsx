"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import GlobalModal from "@/components/ui/GlobalModal";

const images = Array.from(
  { length: 55 },
  (_, i) => `/images/yassirita/yassirita-${i + 1}.webp`
);

const champImages = Array.from(
  { length: 33 },
  (_, i) => `/images/yassirita/champ/champ-${i + 1}.webp`
);

const artImages = Array.from(
  { length: 33 },
  (_, i) => `/images/art/art-${i + 1}.webp`
);

export function ParallaxImageGrid() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <div className="relative w-full min-h-screen overflow-hidden py-24 px-4">
      <h2 className="md:w-fit md:mx-auto font-ter text-7xl max-md:text-4xl text-center bg-text/15 rounded-2xl shadow-2xl z-20 p-4">
        Pequeña Yassirita
      </h2>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-24">
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
                className="object-cover select-none hover:scale-106 duration-700 ease-in-out"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </section>

      <GlobalModal
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        images={images}
      />
    </div>
  );
}

export function ParallaxChampImageGrid() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <div className="relative w-full min-h-screen overflow-hidden pb-24 px-4">
      <h2 className="md:w-fit md:mx-auto font-ter text-7xl max-md:text-4xl text-center bg-text/15 rounded-2xl shadow-2xl z-20 p-4">
        Campeona Yassirita
      </h2>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-24">
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
                className="object-cover select-none hover:scale-106 duration-700 ease-in-out"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </section>

      <GlobalModal
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        images={champImages}
      />
    </div>
  );
}

export function ArtistaImageGrid() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden py-24 px-4">
      <div className="absolute inset-0 w-full h-full border-8 border-main max-md:border-4 pointer-events-none z-10" />

      <div className="relative md:w-fit md:mx-auto">
        <h2 className="relative text-bg font-sec text-8xl max-md:text-7xl text-center rounded-2xl border border-main bg-main z-20 py-8 px-4">
          Artista Yassirita
        </h2>

        <Image
          src="/images/gallery/gallery-2.webp"
          alt="Pretty Yassira"
          fill
          className="w-40! h-40! bg-main object-contain translate-x-130 translate-y-8 rounded-2xl -rotate-65 relative z-0 max-md:z-20 max-md:w-30! max-md:h-30! max-md:translate-x-0 max-sm:translate-y-40"
        />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-24 max-w-338 mx-auto">
        {artImages.map((src, index) => {
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
                className="object-cover select-none shadow-2xl hover:scale-106 duration-700 ease-in-out"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </section>
      <GlobalModal
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        images={artImages}
      />
    </div>
  );
}
