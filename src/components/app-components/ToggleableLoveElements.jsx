"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function ToggleableLoveElements() {
  const [showElement, setShowElement] = useState(true);
  const [currentType, setCurrentType] = useState(null);

  const culturalElements = [
    {
      icon: "🌙",
      title: "Arabic Romance",
      description: "Habibi, you are my moon and stars",
      color: "from-indigo-400 to-purple-400",
    },
    {
      icon: "🌹",
      title: "Latino Passion",
      description: "Mi amor, eres mi todo",
      color: "from-red-400 to-pink-400",
    },
    {
      icon: "🏛️",
      title: "Egyptian Heritage",
      description: "Like the pyramids, our love is eternal",
      color: "from-yellow-400 to-orange-400",
    },
    {
      icon: "💃",
      title: "Argentinian Spirit",
      description: "Our love dances like tango",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: "🐪",
      title: "Desert Journey",
      description: "Through sands of time, I'll always find you",
      color: "from-orange-400 to-red-400",
    },
  ];

  const loveQuotes = [
    {
      text: "Distance means so little when someone means so much",
      author: "Egypt to Argentina",
      emoji: "🌍❤️",
    },
    {
      text: "El amor no conoce fronteras ni distancias",
      author: "Love knows no borders",
      emoji: "🇦🇷💕🇪🇬",
    },
    {
      text: "في الحب، المسافات تذوب والقلوب تتقارب",
      author: "In love, distances melt and hearts come closer",
      emoji: "🌙💝",
    },
    {
      text: "From pyramids to tango, our love writes its own story",
      author: "Egyptian heart, Latino soul",
      emoji: "🏛️🌹💃",
    },
    {
      text: "Nuestro amor es como el Nilo: profundo y eterno",
      author: "Our love is like the Nile: deep and eternal",
      emoji: "🌊💕",
    },
  ];

  useEffect(() => {
    const randomType = Math.random() > 0.5 ? "cultural" : "quote";
    setCurrentType(randomType);
  }, []);

  useEffect(() => {
    if (!showElement || !currentType) return;

    const timer = setTimeout(() => {
      setShowElement(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showElement, currentType]);

  const randomElement =
    culturalElements[Math.floor(Math.random() * culturalElements.length)];
  const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];

  return (
    <AnimatePresence>
      {showElement && currentType === "cultural" && (
        <motion.div
          key="cultural"
          initial={{ opacity: 0, scale: 0.8, y: "100%" }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: "100%" }}
          transition={{ duration: 0.75, delay: 3, ease: "easeOut" }}
          className="fixed bottom-20 left-4 z-40"
        >
          <div className="relative">
            <button
              onClick={() => setShowElement(false)}
              className="absolute -top-2 -right-2 text-text/80 hover:text-text text-sm bg-bg/30 rounded-full w-6 h-6 flex items-center justify-center transition-colors z-10"
            >
              ✕
            </button>
            <div
              className={`bg-linear-to-br ${randomElement.color} rounded-2xl p-4 shadow-xl text-text max-w-xs transition-all duration-1000`}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl animate-bounce">
                  {randomElement.icon}
                </div>
                <h3 className="font-bold text-sm">{randomElement.title}</h3>
                <p className="text-xs italic opacity-90">
                  {randomElement.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {showElement && currentType === "quote" && (
        <motion.div
          key="quote"
          initial={{ opacity: 0, scale: 0.8, x: "-100%" }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: "-100%" }}
          transition={{ duration: 0.75, delay: 3, ease: "easeOut" }}
          className="fixed top-20 left-4 z-40 max-w-xs"
        >
          <div className="relative">
            <button
              onClick={() => setShowElement(false)}
              className="absolute -top-2 -right-2 text-gray-600 hover:text-gray-800 text-sm bg-text/80 rounded-full w-6 h-6 flex items-center justify-center transition-colors z-10"
            >
              ✕
            </button>
            <div className="bg-linear-to-br from-pink-100 to-purple-100 rounded-2xl p-4 shadow-lg border border-pink-200">
              <div className="text-center space-y-2">
                <div className="text-2xl mb-2">{randomQuote.emoji}</div>
                <p className="text-sm text-gray-700 italic font-medium">
                  "{randomQuote.text}"
                </p>
                <p className="text-xs text-gray-500">— {randomQuote.author}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
