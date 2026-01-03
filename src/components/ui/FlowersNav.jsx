import { Flower1, Flower2, Flower3, Flower4 } from "@/components/ui/Flowers";

export default function FlowersNav() {
  return (
    <section className="relative w-full pt-43 max-md:pt-14 duration-300">
      <div className="w-full h-full flex max-md:flex-col justify-center items-center gap-24 max-lg:gap-8 max-md:gap-12 duration-300">
        <Flower1 />
        <Flower2 />
        <Flower3 />
        <Flower4 />
      </div>
    </section>
  );
}
