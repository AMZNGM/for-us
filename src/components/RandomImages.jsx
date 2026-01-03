"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "motion/react";

const images = Array.from(
  { length: 55 },
  (_, i) => `/images/yassirita/yassirita-${i + 1}.webp`
);

const randomPos = () => {
  const r = Math.random();
  return 37 + (r - 0.5) * 60;
};

export default function RandomImages() {
  const [topZ, setTopZ] = useState(1);

  const positions = useMemo(() => {
    return images.map(() => ({
      x: randomPos(),
      y: randomPos(),
      rotate: Math.random() * 40 - 10,
      z: 1,
    }));
  }, []);

  return (
    <section className="relative w-screen h-screen max-md:translate-y-12 md:translate-x-24">
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
          className="w-1/7 max-md:w-32 cursor-grab"
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
