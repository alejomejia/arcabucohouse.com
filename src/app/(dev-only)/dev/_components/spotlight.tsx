"use client";

import { Spotlight } from "@/components/effects/spotlight";
import type { Grid } from "@/components/effects/spotlight/spotlight-images";

const SPOTLIGHT_IMAGES_GRID: Grid = [
  [
    "",
    {
      src: "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/menu-overlay-ceramics.webp",
      alt: "",
      className: "-translate-y-24"
    },
    "",
    {
      src: "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/menu-overlay-rugs.webp",
      alt: ""
    },
  ],
  [
    {
      src: "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/menu-overlay-home.webp",
      alt: "",
      className: "-translate-y-24"
    },
    "",
    "",
    "",
  ],
  [
    "",
    {
      src: "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/menu-overlay-lights.webp",
      alt: "",
      className: "-translate-y-24"
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/menu-overlay-rugs.webp",
      alt: ""
    },
    ""
  ],
  [
    {
      src: "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/menu-overlay-projects.webp",
      alt: "",
      className: "-translate-y-24"
    },
    "",
    "",
    {
      src: "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/menu-overlay-home.webp",
      alt: ""
    },
  ],
  [
    {
      src: "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/menu-overlay-rugs.webp",
      alt: "",
      className: "-translate-y-24"
    },
    "",
    {
      src: "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/menu-overlay-lights.webp",
      alt: ""
    },
    ""
  ],
]

export function SpotlightSection() {
  return (
    <Spotlight.Root className="brand-gradient-primary">
      <Spotlight.Heading className="mix-blend-difference">
        <h2 className="text-center">
          <span className="block uppercase text-2xl tracking-widest text-primary-200">Design as</span>
          <span className="font-serif text-6xl text-primary-100">Cultural Expression</span>
        </h2>
      </Spotlight.Heading>
      <Spotlight.Images grid={SPOTLIGHT_IMAGES_GRID} />
      <Spotlight.Mask>
        <Spotlight.MaskImage imgProps={{ className: "object-bottom" }} />
        <Spotlight.MaskHeading>
          <h2 className="text-center uppercase text-8xl">
            <span className="block">Elevating</span>
            <span className="">South American Design</span>
          </h2>
        </Spotlight.MaskHeading>
      </Spotlight.Mask>
    </Spotlight.Root>
  );
}
