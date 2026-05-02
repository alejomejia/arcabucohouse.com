
import { ParallaxVideo } from "@/components/effects/parallax";
import { HeroHeader } from "./header";

export async function HeroSection() {
  return (
    <section className="relative bg-zinc-950 pt-16 pb-8 min-h-screen flex flex-col justify-center items-center grow">
      <div className="absolute inset-0 z-0">
        <div className="bg-zinc-950/95 backdrop-blur-xs absolute inset-0 z-10" />
        <ParallaxVideo src="/hero-bg.mp4" className="object-top" loop />
      </div>
      <HeroHeader />
    </section>
  );
}
