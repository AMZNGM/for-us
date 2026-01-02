import { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import LoadingScreen from "@/components/LoadingScreen";
import GradientCursor from "@/components/ui/cursors/GradientCursor";
import { ArtistaImageGrid } from "@/components/ParallaxImageGrid";

export const metadata = {
  title: "For Us <3 | Yassirita",
  description: "Yassira as Artist.",
};

export default function YassirasArtPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSkeleton />}>
        <ScrollIndicator />
        {/* <LoadingScreen /> */}
        <GradientCursor />
        <ArtistaImageGrid />
      </Suspense>
    </ProtectedRoute>
  );
}
