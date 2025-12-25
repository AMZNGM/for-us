import { Suspense } from "react";
import Hero from "@/components/Hero";

export const metadata = {
  title: "For Us <3",
  description: "Just Yassira and Abdelrahman page, nothing more nothing less.",
};

function LoadingSkeleton() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-2 animate-pulse">
        <div className="bg-text/50 rounded-lg h-8 w-32"></div>
        <div className="bg-text/40 rounded-lg h-4 w-64"></div>
        <div className="bg-text/40 rounded-lg h-4 w-64"></div>
        <div className="bg-text/40 rounded-lg h-4 w-64"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Hero />
    </Suspense>
  );
}
