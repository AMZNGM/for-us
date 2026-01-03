"use client";

import { useEffect, useState } from "react";
import { useScroll } from "motion/react";

export function useScrollPosition(thresholdVh = 1) {
  const { scrollY } = useScroll();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      const vh = window.innerHeight * thresholdVh;
      setActive(y >= vh);
    });

    return () => unsubscribe();
  }, [scrollY, thresholdVh]);

  return active;
}
