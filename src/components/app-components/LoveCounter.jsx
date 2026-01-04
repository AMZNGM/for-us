"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function LoveCounter() {
  const [showDetails, setShowDetails] = useState(false);

  const startDate = new Date("2025-06-01");
  const currentDate = new Date();
  const daysTogether = Math.floor(
    (currentDate - startDate) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="fixed bottom-4 right-0 z-10">
      <div className="relative">
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className=" bg-main rounded-lg text-text shadow-lg hover:scale-110 hover:right-0 transition-all duration-300 cursor-pointer py-4 px-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm">❤️‍🔥</span>
        </motion.button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-16 right-4 bg-text rounded-2xl shadow-2xl p-4 w-64 border-2 border-pink-200"
            >
              <div className="text-center space-y-2">
                <motion.div
                  className="text-lg font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  🇪🇬 + 🇦🇷 = 💛
                </motion.div>
                <motion.div
                  className="text-2xl font-bold text-pink-500"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {daysTogether} days
                </motion.div>
                <motion.div
                  className="text-xs text-gray-500 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  of beautiful memories
                </motion.div>
                <motion.div
                  className="flex justify-center space-x-1 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    🌙
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    ❤️
                  </motion.span>
                  <motion.span
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    🌹
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2.5,
                    }}
                  >
                    💕
                  </motion.span>
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                  >
                    ⭐
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
