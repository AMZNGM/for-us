import { useState, useEffect } from "react";

export function useIsScrollable() {
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      if (typeof window === "undefined") return;
      const hasScrollbar = document.body.scrollHeight > window.innerHeight;
      setIsScrollable(hasScrollbar);
    };

    checkScrollable();

    const handleResize = () => {
      window.requestAnimationFrame(checkScrollable);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("load", checkScrollable);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", checkScrollable);
    };
  }, []);

  return isScrollable;
}
