import Image from "next/image";
import { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import GradientCursor from "@/components/ui/cursors/GradientCursor";
import TextAnimation from "@/components/ui/text/TextAnimation";
import Logo from "@/components/ui/Logo";
import FlowersNav from "@/components/ui/FlowersNav";

export const metadata = {
  title: "For Us <3",
  description: "Just Yassira and Abdelrahman page, nothing more nothing less.",
};

export default function Home() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSkeleton />}>
        <main className="relative w-screen h-screen overflow-hidden bg-bg text-main">
          <div className="absolute inset-0 w-full h-full border-8 max-md:border-4 pointer-events-none z-10" />

          <GradientCursor />

          <Image
            src="/images/art/art-61.webp"
            alt="background"
            fill
            className="absolute inset-0 w-full h-full object-cover pointer-events-none blur-sm opacity-50"
          />

          <div className="w-full h-full flex flex-col justify-center items-center gap-8 max-md:gap-0">
            <TextAnimation
              text="Welcome To"
              duration={1}
              className="text-4xl max-md:text-3xl text-center font-sec"
            />

            <Logo />

            <FlowersNav />
          </div>
        </main>
      </Suspense>
    </ProtectedRoute>
  );
}
