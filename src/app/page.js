import { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Hero from "@/components/Hero";

export const metadata = {
  title: "For Us <3",
  description: "Just Yassira and Abdelrahman page, nothing more nothing less.",
};

export default function Home() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSkeleton />}>
        <Hero />
      </Suspense>
    </ProtectedRoute>
  );
}
