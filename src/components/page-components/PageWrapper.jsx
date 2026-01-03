import Image from "next/image";
import GradientCursor from "@/components/ui/cursors/GradientCursor";
import ScrollIndicator from "@/components/ui/ScrollIndicator";

export default function PageWrapper({
  children,
  className = "",
  look = "dark",
  imageCLassName = "",
}) {
  if (look === "bright") {
    look = "bg-text";
  }
  if (look === "dark") {
    look = "bg-bg";
  }

  return (
    <main
      className={`relative w-screen min-h-screen overflow-hidden text-bg ${look} ${className}`}
    >
      <GradientCursor />
      <ScrollIndicator />

      <div className="absolute inset-0 w-full h-full border-8 border-main max-md:border-4 pointer-events-none z-10" />

      <Image
        src="/images/yassirita/yassirita-12.webp"
        alt="background"
        fill
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none opacity-55 blur-xl z-0 ${imageCLassName}`}
      />

      {children}
    </main>
  );
}

export function HomePageWrapper({ children }) {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-bg text-main">
      <GradientCursor />

      <div className="absolute inset-0 w-full h-full border-8 max-md:border-4 pointer-events-none z-10" />

      <div className="w-full h-full flex flex-col justify-center items-center gap-8 max-md:gap-0">
        <Image
          src="/images/art/art-61.webp"
          alt="background"
          fill
          className="absolute inset-0 w-full h-full object-cover pointer-events-none blur-sm opacity-50"
        />

        {children}
      </div>
    </main>
  );
}
