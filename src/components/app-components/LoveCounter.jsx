"use client";

import { useState } from "react";

export default function LoveCounter() {
  const [showDetails, setShowDetails] = useState(false);

  const startDate = new Date("2025-06-01");
  const currentDate = new Date();
  const daysTogether = Math.floor(
    (currentDate - startDate) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <div className="relative">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-linear-to-r from-red-500 to-red-400 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse cursor-pointer"
        >
          <span className="text-sm">❤️‍🔥</span>
        </button>

        {showDetails && (
          <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl p-4 w-64 border-2 border-pink-200">
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-gray-800">
                🇪🇬 + 🇦🇷 = 💛
              </div>
              <div className="text-2xl font-bold text-pink-500">
                {daysTogether} days
              </div>
              <div className="text-xs text-gray-500 italic">
                of beautiful memories
              </div>
              <div className="flex justify-center space-x-1 text-xs">
                <span>🌙</span>
                <span>❤️</span>
                <span>🌹</span>
                <span>💕</span>
                <span>⭐</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
