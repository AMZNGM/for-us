"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function DockIcon({
  children,
  mouseX,
  href,
  onClick,
  isActive,
  magnification = 60,
  distance = 140,
}) {
  const ref = useRef(null);
  const distanceFromMouse = useMotionValue(Infinity);
  const widthSync = useTransform(
    distanceFromMouse,
    [0, distance],
    [magnification, 40]
  );
  const width = useSpring(widthSync, { stiffness: 260, damping: 20 });

  useEffect(() => {
    const updateDistance = () => {
      if (ref.current && mouseX.get() !== null) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const distance = Math.abs(mouseX.get() - centerX);
        distanceFromMouse.set(distance);
      }
    };

    const unsubscribe = mouseX.on("change", updateDistance);
    return unsubscribe;
  }, [mouseX, distanceFromMouse]);

  const content = (
    <motion.div
      ref={ref}
      style={{ width }}
      className={`relative flex items-center justify-center aspect-square cursor-pointer transition-colors ${
        isActive ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
      } backdrop-blur-sm rounded-2xl`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className="flex items-center">
      {content}
    </button>
  );
}
