"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const images = Array.from(
  { length: 55 },
  (_, i) => `/images/yassirita/yassirita-${i + 1}.webp`
);

// random أقرب للمنتصف
const centerRandom = () => {
  const r = Math.random();
  return 45 + (r - 0.5) * 70; // 30% → 70%
};

export default function RandomImages() {
  const [topZ, setTopZ] = useState(1);

  const positions = useMemo(() => {
    return images.map(() => ({
      x: centerRandom(),
      y: centerRandom(),
      rotate: Math.random() * 20 - 10,
      z: 1,
    }));
  }, []);

  return (
    <section className="relative w-screen h-screen overflow-hidden">
      {images.map((image, index) => (
        <motion.div
          key={index}
          drag
          dragMomentum={false}
          dragElastic={0.25}
          onDragStart={() => {
            setTopZ((prev) => prev + 1);
            positions[index].z = topZ + 1;
          }}
          whileDrag={{
            scale: 1.1,
            cursor: "grabbing",
          }}
          dragTransition={{ bounceStiffness: 250, bounceDamping: 25 }}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: index * 0.02 }}
          style={{
            position: "absolute",
            left: `${positions[index].x}%`,
            top: `${positions[index].y}%`,
            rotate: positions[index].rotate,
            zIndex: positions[index].z,
          }}
          className="w-32 sm:w-28 md:w-32 lg:w-36 cursor-grab"
        >
          <Image
            src={image}
            alt={`yassirita-${index + 1}`}
            draggable={false}
            width={100}
            height={100}
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 20vw"
            className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
          />
        </motion.div>
      ))}
    </section>
  );
}
