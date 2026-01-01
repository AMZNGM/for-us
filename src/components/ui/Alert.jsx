"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Alert({ open, message, type = "info", onClose }) {
  const color =
    type === "success"
      ? "bg-main"
      : type === "error"
      ? "bg-red-600"
      : "bg-sky-600";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 1, y: "400%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "400%" }}
          transition={{
            type: "spring",
            stiffness: 100,
            opacity: { delay: 1 },
          }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-center items-center z-50"
        >
          <div
            role="alert"
            className={`${color} flex justify-center items-center text-bg rounded-md shadow-lg gap-2 py-2 px-4 -translate-x-8`}
          >
            <div className="flex-1 text-sm">{message}</div>
            <button
              aria-label="Close alert"
              onClick={onClose}
              className="w-6 h-6 flex justify-center items-center cursor-pointer"
            >
              ✕
            </button>

            <Image
              src="/images/yassirita-drink-mate-no-bg.webp"
              alt="background"
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain pointer-events-none scale-1000 translate-x-18"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
