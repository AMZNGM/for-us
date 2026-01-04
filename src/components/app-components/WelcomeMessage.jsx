"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import MainBtn from "@/components/ui/buttons/MainBtn";

export default function WelcomeMessage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hasVisited = localStorage.getItem("has-visited-app");

    if (!hasVisited) {
      const hour = new Date().getHours();
      let timeGreeting = "Good Morning";

      if (hour >= 12 && hour < 18) {
        timeGreeting = "Good Afternoon";
      } else if (hour >= 18) {
        timeGreeting = "Good Evening";
      }

      setGreeting(timeGreeting);
      setShowWelcome(true);
      localStorage.setItem("has-visited-app", "true");
    }
  }, []);

  const handleClose = () => {
    setShowWelcome(false);
  };

  if (!showWelcome) return null;

  return (
    <div className="fixed inset-0 bg-bg/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-text rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-bg/60 hover:text-bg transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🌅</div>

          <h2 className="text-3xl font-bold text-bg">
            Good Morning, My Love! 💕
          </h2>

          <p className="text-bg/80 italic text-lg">
            🌅 Good afternoon to youu 🌅
            <br />
            🏞️ Good morning to mee 🏞️
          </p>

          <p className="text-bg/70">
            Welcome to our special place where Egyptian hearts meet Latino
            souls, creating a ❣️ story that spans continents and cultures.
          </p>

          <div className="flex justify-center space-x-2 text-2xl animate-pulse">
            <span>💕</span>
            <span>🌸</span>
            <span>💖</span>
            <span>🌺</span>
            <span>💝</span>
          </div>

          <MainBtn onClick={handleClose} className="font-main mx-auto">
            Let's Start Our Day 💕
          </MainBtn>
        </div>
      </motion.div>
    </div>
  );
}
