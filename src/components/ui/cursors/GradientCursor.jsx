"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMouseMotion } from "@/hooks/useMouseMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function GradientCursor() {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const mouseState = useMouseMotion(ref);
  const particlesRef = useRef([]);
  const lastUpdateRef = useRef(0);
  const particleIdRef = useRef(0);
  const [hue, setHue] = useState(0);
  const [, forceUpdate] = useState({});

  const updateParticles = useCallback((x, y) => {
    const now = performance.now();
    if (now - lastUpdateRef.current < 50) return;
    lastUpdateRef.current = now;
    const newHue = x % 360;
    setHue(newHue);

    const newParticles = Array.from({ length: 2 }, (_, index) => ({
      id: `${Date.now()}-${particleIdRef.current++}-${index}`,
      x: x + (Math.random() - 0.5) * 15,
      y: y + (Math.random() - 0.5) * 15,
      size: Math.random() * 2 + 5,
      intensity: Math.random() * 0.3 + 0.1,
    }));

    particlesRef.current = [...particlesRef.current, ...newParticles].slice(
      -20
    );
    forceUpdate({});
  }, []);

  useEffect(() => {
    const unsubscribeX = mouseState.x.on("change", (x) => {
      const y = mouseState.y.get();
      updateParticles(x, y);
    });

    return () => unsubscribeX();
  }, [mouseState, updateParticles]);

  if (isMobile) return;

  return (
    <>
      <motion.div
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          x: mouseState.x,
          y: mouseState.y,
          width: "30px",
          height: "30px",
        }}
        className="fixed pointer-events-none z-5"
      >
        <div
          className="w-full h-full opacity-50 rounded-full mix-blend-screen"
          style={{
            background: `radial-gradient(
                circle at center,
                hsl(${hue}, 100%, 70%),
                hsl(${(hue + 60) % 360}, 100%, 60%)
              )`,
            boxShadow: `0 0 15px hsl(${hue}, 100%, 50%, 0.3)`,
          }}
        />
      </motion.div>

      <AnimatePresence mode="popLayout">
        {particlesRef.current.map((particle, index) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: particle.intensity, scale: 0 }}
            animate={{ opacity: 0, scale: particle.size }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              left: particle.x,
              top: particle.y,
            }}
            className="fixed -translate-1/2 pointer-events-none mix-blend-screen z-5"
          >
            <div
              style={{
                width: `${particle.size * 4}px`,
                height: `${particle.size * 4}px`,
                background: `radial-gradient(
                circle at center,
                hsl(${hue}, 100%, 70%),
                hsl(${(hue + 60) % 360}, 100%, 60%)
              )`,
                boxShadow: `0 0 15px hsl(${hue}, 100%, 50%, 0.3)`,
              }}
              className="rounded-full blur-[1.5px]"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
