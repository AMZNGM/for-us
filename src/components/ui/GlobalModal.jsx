"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";

const images = Array.from(
  { length: 55 },
  (_, i) => `/images/yassirita/yassirita-${i + 1}.webp`
);

export default function GlobalModal({ activeImage, setActiveImage }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeImage) return;

      switch (e.key) {
        case "Escape":
          setActiveImage(null);
          break;
        case "ArrowLeft":
          navigateImage(-1);
          break;
        case "ArrowRight":
          navigateImage(1);
          break;
      }
    };

    const navigateImage = (direction) => {
      const currentIndex = images.indexOf(activeImage);
      const newIndex = currentIndex + direction;

      if (newIndex >= 0 && newIndex < images.length) {
        setActiveImage(images[newIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImage, setActiveImage]);

  return (
    <AnimatePresence>
      {activeImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveImage(null)}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt="preview"
              width={1600}
              height={2000}
              className="rounded-3xl object-contain max-h-[90vh]"
              priority
            />

            {/* Navigation Arrows */}
            <button
              onClick={() => {
                const currentIndex = images.indexOf(activeImage);
                const prevIndex =
                  currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                setActiveImage(images[prevIndex]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:bg-white transition-colors"
            >
              ←
            </button>

            <button
              onClick={() => {
                const currentIndex = images.indexOf(activeImage);
                const nextIndex =
                  currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                setActiveImage(images[nextIndex]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:bg-white transition-colors"
            >
              →
            </button>

            {/* close */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-4 -right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-xl hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>

            {/* Image Counter */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {images.indexOf(activeImage) + 1} / {images.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
