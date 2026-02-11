import { ParallaxImage, ParallaxVideo } from "@/components/effects/parallax";
import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { OVERLAY_IMAGES_SHAPE } from "@/lib/integrations/shopify/config";

import { Heading } from "./heading";

export function DesignServicesSection() {
  return (
    <Grid as="section" className="py-24">
      <Heading />
      <Container className="col-span-full grid grid-cols-subgrid">
        <div className="col-span-7 flex flex-col justify-center gap-4 py-12">
          <h2 className="text-primary-base mb-6">
            <span className="block font-serif text-3xl lg:text-4xl italic text-pretty leading-none">
              Design Services
            </span>
            <span className="text-4xl lg:text-5xl tracking-wider uppercase text-secondary-300">
              for Thoughtful Spaces
            </span>
          </h2>
          <div className="text-primary-400 font-serif text-xl mb-8">
            <p className="indent-[5vw]">We collaborate with clients to design interiors defined by clarity, material richness, and timeless aesthetics. Our approach blends architectural thinking with curated design pieces to create spaces that feel intentional, refined, and enduring.</p>
          </div>
          <UnderlineLink
            className="text-lg font-semibold uppercase leading-none font-serif"
            href="/about">
            Discover Our Approach
          </UnderlineLink>
        </div>
        <div className="col-start-9 col-end-17 min-h-[150vh]">
          <ParallaxImage src={OVERLAY_IMAGES_SHAPE.home} alt="" />
        </div>
        <div className="col-start-18 -col-end-1 flex flex-col justify-center gap-12 py-12">
          <div className="flex flex-col gap-12 min-h-[100vh]">
            <ParallaxVideo src="/video-01.mp4" className="object-top" loop />
            <ParallaxVideo src="/video-02.mp4" className="object-top" loop />
          </div>
          <div className="text-primary-400 font-serif text-xl mb-8">
            <p className="indent-[5vw]">Each project is approached as a curated composition—thoughtfully designed to reflect both the space and the people who inhabit it.</p>
          </div>
        </div>
      </Container>
    </Grid>
  )
}