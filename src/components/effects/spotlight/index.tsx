"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/utils/helpers";

import { useSpotlight, type UseSpotlightOptions } from "./hooks/use-spotlight";
import { SpotlightContext } from "./spotlight-context";
import { SpotlightHeading } from "./spotlight-heading";
import { SpotlightImages } from "./spotlight-images";
import { SpotlightMask } from "./spotlight-mask";
import { SpotlightMaskHeading } from "./spotlight-mask-heading";
import { SpotlightMaskImage } from "./spotlight-mask-image";

/**
 * Props for Spotlight.Root.
 *
 * @property children - Compound subcomponents (Heading, Images, Mask, etc.)
 * @property className - Optional class for the pinned section wrapper
 */
export type SpotlightRootProps = {
  children: ReactNode;
  className?: string;
  options?: UseSpotlightOptions;
};

/**
 * Root of the Spotlight compound component. Uses useSpotlight for refs and
 * GSAP scroll animations (pin, image scroll, mask reveal, word reveal).
 *
 * @param children - Compound subcomponents
 * @param className - Optional section class (default: min-h-dvh, overflow hidden, bg)
 */
function SpotlightRoot({ options, children, className }: SpotlightRootProps) {
  const { contextValue, sectionRef } = useSpotlight(options);

  return (
    <SpotlightContext.Provider value={contextValue}>
      <section
        ref={sectionRef}
        className={cn("relative w-full min-h-dvh overflow-hidden bg-zinc-900 text-zinc-100", className)}
      >
        {children}
      </section>
    </SpotlightContext.Provider>
  );
}

export const Spotlight = {
  Root: SpotlightRoot,
  Heading: SpotlightHeading,
  Images: SpotlightImages,
  Mask: SpotlightMask,
  MaskImage: SpotlightMaskImage,
  MaskHeading: SpotlightMaskHeading,
};
