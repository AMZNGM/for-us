"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function InstaMessages() {
  const [showMessages, setShowMessages] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const InstaMessages = [
    {
      sender: "Candela",
      message: "Hahahahaha nooo",
      date: "Dec 03, 2025",
      emoji: "😂",
      color: "from-pink-400 to-rose-400",
    },
    {
      sender: "NGM",
      message: "No way you like that😂😂😂😂😂 do you don't understand me?😅",
      date: "Dec 21, 2025",
      emoji: "😅",
      color: "from-blue-400 to-indigo-400",
    },
    {
      sender: "Candela",
      message:
        "Hahahaha, I'd have to act like a psychotic or schizophrenic in any case",
      date: "Nov 09, 2025",
      emoji: "🤭",
      color: "from-pink-400 to-rose-400",
    },
    {
      sender: "NGM",
      message: "Woow thats so interesting",
      date: "Nov 09, 2025",
      emoji: "😍",
      color: "from-blue-400 to-indigo-400",
    },
    {
      sender: "Candela",
      message: "Yeees",
      date: "Nov 09, 2025",
      emoji: "😊",
      color: "from-pink-400 to-rose-400",
    },
    {
      sender: "NGM",
      message: "Brother?!!",
      date: "Nov 07, 2025",
      emoji: "😲",
      color: "from-blue-400 to-indigo-400",
    },
    {
      sender: "Candela",
      message: 'Hahahahhahahahaha "tell my family that I loveeeem"',
      date: "Nov 08, 2025",
      emoji: "❤️",
      color: "from-pink-400 to-rose-400",
    },
    {
      sender: "NGM",
      message: "He is so beautiful",
      date: "Nov 07, 2025",
      emoji: "🥰",
      color: "from-blue-400 to-indigo-400",
    },
    {
      sender: "Candela",
      message:
        "Hahaha, I don't understand where this character came from, but it's incredible.",
      date: "Nov 08, 2025",
      emoji: "🤔",
      color: "from-pink-400 to-rose-400",
    },
    {
      sender: "NGM",
      message: "Woww",
      date: "Nov 07, 2025",
      emoji: "✨",
      color: "from-blue-400 to-indigo-400",
    },
  ];

  useEffect(() => {
    if (showMessages) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % InstaMessages.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [showMessages, InstaMessages.length]);

  const currentMessage = InstaMessages[currentMessageIndex];

  return (
    <div className="fixed md:top-1/2 md:left-5.5 md:translate-y-25 z-50 max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2">
      <AnimatePresence>
        {/* Toggle Button */}
        {!showMessages && (
          <motion.button
            onClick={() => setShowMessages(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="-translate-y-4 bg-main rounded-lg text-text shadow-lg hover:scale-110 hover:right-0 transition-all duration-300 cursor-pointer py-1 px-1"
          >
            💌
          </motion.button>
        )}

        {showMessages && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <motion.button
              onClick={() => setShowMessages(false)}
              className="absolute -top-2 -right-2 text-gray-600 hover:text-bg text-sm bg-white/90 rounded-full w-6 h-6 flex items-center justify-center transition-colors z-10 shadow-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>

            <div
              className={`bg-linear-to-br ${currentMessage.color} rounded-2xl p-4 shadow-2xl text-white max-w-sm min-w-[280px] border border-white/20`}
            >
              <div className="space-y-3">
                <p className="text-xs text-center opacity/80">
                  Old Insta Messages
                </p>

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="text-2xl"
                    >
                      {currentMessage.emoji}
                    </motion.div>
                    <div>
                      <div className="font-bold text-sm">
                        {currentMessage.sender}
                      </div>
                      <div className="text-xs opacity/80">
                        {currentMessage.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      💕
                    </motion.span>
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 5,
                      }}
                    >
                      ⭐
                    </motion.span>
                  </div>
                </div>

                {/* Message */}
                <motion.div
                  key={currentMessageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/20 rounded-xl p-3 backdrop-blur-sm"
                >
                  <p className="text-sm leading-relaxed">
                    {currentMessage.message}
                  </p>
                </motion.div>

                {/* Progress indicators */}
                <div className="flex justify-center gap-1">
                  {InstaMessages.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-1 rounded-full transition-colors ${
                        index === currentMessageIndex
                          ? "bg-white w-6"
                          : "bg-white/40 w-1"
                      }`}
                      animate={{
                        scale: index === currentMessageIndex ? [1, 1.2, 1] : 1,
                      }}
                      transition={{
                        duration: 2,
                        repeat: index === currentMessageIndex ? Infinity : 0,
                        repeatDelay: 3,
                      }}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="text-center">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-xs italic opacity/90"
                  >
                    🇪🇬 + 🇦🇷 = Forever 💛
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
