import { useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";

export function useMouseMotion(ref, { springConfig } = {}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, springConfig || { stiffness: 250, damping: 40 });
  const sy = useSpring(y, springConfig || { stiffness: 250, damping: 40 });

  useEffect(() => {
    const element = ref.current || window;

    const handleMouseMove = (e) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
      }
    };

    element.addEventListener("mousemove", handleMouseMove);
    return () => element.removeEventListener("mousemove", handleMouseMove);
  }, [ref, x, y]);

  return { x: sx, y: sy };
}
