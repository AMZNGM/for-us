import ProtectedRoute from "@/components/page-components/ProtectedRoute";
import PageWrapper from "@/components/page-components/PageWrapper";
import { ArtistaImageGrid } from "@/components/ParallaxImageGrid";

export const metadata = {
  title: "For Us <3 | Yassirita",
  description: "Yassira as Artist.",
};

export default function YassirasArtPage() {
  return (
    <ProtectedRoute>
      <PageWrapper>
        <ArtistaImageGrid />
      </PageWrapper>
    </ProtectedRoute>
  );
}
