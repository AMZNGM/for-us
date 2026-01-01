import Image from "next/image";
import { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import GradientCursor from "@/components/ui/cursors/GradientCursor";
import TextAnimation from "@/components/ui/text/TextAnimation";
import RandomImages from "@/components/RandomImages";
import {
  ParallaxImageGrid,
  ParallaxChampImageGrid,
} from "@/components/ParallaxImageGrid";

export const metadata = {
  title: "For Us <3 | Yassirita",
  description: "little Yassira every where.",
};

export default function YassiritaPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSkeleton />}>
        <main className="relative w-screen min-h-screen overflow-hidden bg-bg text-gold">
          <Image
            src="/images/yassirita/yassirita-12.webp"
            alt="background"
            fill
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-15 blur-xl z-0"
          />

          <TextAnimation
            text="Yassirita"
            duration={1}
            delay={0.2}
            className="absolute text-4xl max-md:text-2xl font-sec mt-1.5 p-4"
          />

          <GradientCursor />
          <RandomImages />
          <ParallaxImageGrid />
          <ParallaxChampImageGrid />
        </main>
      </Suspense>
    </ProtectedRoute>
  );
}
