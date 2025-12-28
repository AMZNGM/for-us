"use client";

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
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 500,
            mass: 5,
          }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-center items-center z-50"
        >
          <motion.div
            role="alert"
            className={`${color} flex justify-center items-center text-text rounded-md shadow-lg px-4 py-2 gap-4`}
          >
            <div className="flex-1 text-sm">{message}</div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close alert"
              onClick={onClose}
              className="opacity-90 hover:opacity-100 text-white/90 w-5 h-5 flex items-center justify-center"
            >
              ✕
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
