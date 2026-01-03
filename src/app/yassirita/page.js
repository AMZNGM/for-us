import ProtectedRoute from "@/components/page-components/ProtectedRoute";
import PageWrapper from "@/components/page-components/PageWrapper";
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
      <PageWrapper
        look="dark"
        imageCLassName="opacity-15!"
        className="text-main"
      >
        <TextAnimation
          text="Yassirita"
          duration={1}
          delay={0.2}
          className="absolute top-25 text-8xl max-md:text-5xl font-sec mt-1.5 p-4"
        />
        <RandomImages />
        <ParallaxImageGrid />
        <ParallaxChampImageGrid />
      </PageWrapper>
    </ProtectedRoute>
  );
}
