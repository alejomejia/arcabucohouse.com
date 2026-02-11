import { ParallaxImage } from "@/components/effects/parallax";
import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Grid } from "@/components/ui/grid";
import { OVERLAY_IMAGES_SHAPE } from "@/lib/integrations/shopify/config";
import { cn } from "@/lib/utils/helpers";

export function AboutSection() {
  return (
    <Grid as="section" className="py-24">
      <div className="col-span-7 min-h-[75vh]">
        <ParallaxImage src={OVERLAY_IMAGES_SHAPE.home} alt="About" />
      </div>
      <div className="col-start-10 col-end-16 flex flex-col justify-between gap-4 py-12">
        <div className="mb-12">
          <h2 className="text-primary-base mb-12">
            <span className="block font-serif text-3xl lg:text-4xl italic text-pretty leading-none">
              Design as
            </span>
            <span className="text-4xl lg:text-5xl tracking-wider uppercase text-secondary-300">
              Cultural Expression
            </span>
          </h2>
          <div className={cn(
            "max-w-148 flex flex-col gap-6",
            "text-primary-400 font-serif text-xl"
          )}>
            <p className="indent-[5vw]">We are a creative collective dedicated to elevating the visibility of South American creative talent and design.</p>
            <p>Rooted in architecture and interior design, Arcabuco curates objects conceived as functional works of art—pieces that carry cultural depth, material integrity, and a contemporary design vision.</p>
            <p>We collaborate with skilled workshops, independent makers, and design-driven manufacturers to bring thoughtful objects to life—ranging from limited handcrafted editions to carefully produced pieces that can be lived with and collected over time.</p>
          </div>
        </div>
        <UnderlineLink
          href="/about"
          className="text-lg font-semibold uppercase leading-none font-serif"
        >
          Explore The Collective
        </UnderlineLink>
      </div>
      <div className="col-start-18 -col-end-1  min-h-[75vh]">
        <ParallaxImage src={OVERLAY_IMAGES_SHAPE.rugs} alt="About" />
      </div>
    </Grid>
  )
}