"use client";

import { useEffect, useState } from "react";

export default function HeartParticles({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 40 - 20, // Random position around center
      y: Math.random() * 40 - 20,
      delay: Math.random() * 0.3,
      duration: 1 + Math.random() * 0.5,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 2000);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-red-500 text-xs animate-pulse"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translate(${particle.x}px, ${particle.y}px)`,
            animation: `float-up ${particle.duration}s ease-out ${particle.delay}s forwards`,
          }}
        >
          ♥
        </div>
      ))}
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%)
              translate(var(--x, 0), var(--y, -20px)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%)
              translate(var(--x, 0), var(--y, -40px)) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
}
