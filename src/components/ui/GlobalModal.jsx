"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";

export default function GlobalModal({
  activeImage,
  setActiveImage,
  images = [],
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeImage || images.length === 0) return;

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
  }, [activeImage, setActiveImage, images]);

  return (
    <AnimatePresence>
      {activeImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 flex justify-center items-center bg-bg/80 backdrop-blur-md z-50"
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90vw] max-h-[90vh]"
          >
            <Image
              src={activeImage}
              alt="preview"
              width={1600}
              height={2000}
              priority
              className="rounded-3xl object-contain max-h-[90vh]"
            />

            <button
              onClick={() => {
                const currentIndex = images.indexOf(activeImage);
                const prevIndex =
                  currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                setActiveImage(images[prevIndex]);
              }}
              className="absolute bottom-1/2 -left-4 max-md:-bottom-18 max-md:left-0 md:-translate-x-1/2 w-12 h-12 bg-main/80 text-bg rounded-full flex justify-center items-center shadow-xl hover:bg-text transition-colors cursor-pointer"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => {
                const currentIndex = images.indexOf(activeImage);
                const nextIndex =
                  currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                setActiveImage(images[nextIndex]);
              }}
              className="absolute bottom-1/2 -right-4 max-md:-bottom-18 max-md:right-0 md:translate-x-1/2 w-12 h-12 bg-main/80 text-bg rounded-full flex justify-center items-center shadow-xl hover:bg-text transition-colors cursor-pointer"
            >
              <ChevronRight />
            </button>

            <div className="absolute -bottom-10 max-md:-bottom-16 left-1/2 -translate-x-1/2 bg-bg/60 text-main px-3 py-1 rounded-full text-sm">
              {images.indexOf(activeImage) + 1} / {images.length}
            </div>
          </motion.div>

          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-main text-bg rounded-full flex justify-center items-center shadow-xl hover:bg-text transition-colors cursor-pointer"
          >
            <XIcon />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
