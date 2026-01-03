"use client";

import { usePathname } from "next/navigation";
import TextAnimation from "@/components/ui/text/TextAnimation";

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/new-post" ||
    pathname === "/profile"
  ) {
    return null;
  }

  return (
    <footer className="sticky bottom-0 w-screen h-200 overflow-hidden bg-bg text-main flex justify-center items-center px-14 -z-10">
      <TextAnimation
        text={
          "- Every time you Smile when you Remember me, a Flower blooms in Jannah -"
        }
        className="text-7xl max-md:text-4xl font-sec text-center"
      />
    </footer>
  );
}
