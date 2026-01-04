"use client";

import { useState, useEffect } from "react";

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
    // Randomly choose between cultural element or love quote on mount
    const randomType = Math.random() > 0.5 ? "cultural" : "quote";
    setCurrentType(randomType);
  }, []);

  if (!showElement || !currentType) return null;

  if (currentType === "cultural") {
    const randomElement =
      culturalElements[Math.floor(Math.random() * culturalElements.length)];

    return (
      <div className="fixed bottom-20 left-4 z-40">
        <div className="relative">
          <button
            onClick={() => setShowElement(false)}
            className="absolute -top-2 -right-2 text-white/80 hover:text-white text-sm bg-black/30 rounded-full w-6 h-6 flex items-center justify-center transition-colors z-10"
          >
            ✕
          </button>
          <div
            className={`bg-linear-to-br ${randomElement.color} rounded-2xl p-4 shadow-xl text-white max-w-xs transition-all duration-1000`}
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
      </div>
    );
  }

  if (currentType === "quote") {
    const randomQuote =
      loveQuotes[Math.floor(Math.random() * loveQuotes.length)];

    return (
      <div className="fixed top-20 left-4 z-40 max-w-xs">
        <div className="relative">
          <button
            onClick={() => setShowElement(false)}
            className="absolute -top-2 -right-2 text-gray-600 hover:text-gray-800 text-sm bg-white/80 rounded-full w-6 h-6 flex items-center justify-center transition-colors z-10"
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
      </div>
    );
  }

  return null;
}
