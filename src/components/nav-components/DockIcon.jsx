"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";

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
      className={`relative flex justify-center items-center aspect-square transition-colors cursor-pointer ${
        isActive ? "bg-text/20" : "bg-text/10 hover:bg-text/15"
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
