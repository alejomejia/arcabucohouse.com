"use client"

import { type ReactNode } from "react"

import { cn } from "@/lib/utils/helpers"

import { useSpotlight, type UseSpotlightOptions } from "./hooks/use-spotlight"
import { SpotlightContext } from "./spotlight.context"
import { SpotlightHeading } from "./spotlight-heading"
import { SpotlightImages } from "./spotlight-images"
import { SpotlightMask } from "./spotlight-mask"
import { SpotlightMaskHeading } from "./spotlight-mask-heading"
import { SpotlightMaskImage } from "./spotlight-mask-image"

export type SpotlightRootProps = {
  children: ReactNode
  className?: string
  options?: UseSpotlightOptions
}

/**
 * Root of the Spotlight compound component. Pins the section while the
 * user scrolls through it, animating an image strip, a mask reveal, and
 * a per-word headline animation via {@link useSpotlight}.
 *
 * @example
 * ```tsx
 * <Spotlight>
 *   <Spotlight.Heading>Our work</Spotlight.Heading>
 *   <Spotlight.Images>…</Spotlight.Images>
 *   <Spotlight.Mask>
 *     <Spotlight.MaskImage src="/banner.jpg" alt="" />
 *     <Spotlight.MaskHeading>Headline that reveals as you scroll</Spotlight.MaskHeading>
 *   </Spotlight.Mask>
 * </Spotlight>
 * ```
 */
function SpotlightRoot({ options, children, className }: SpotlightRootProps) {
  const { contextValue, sectionRef } = useSpotlight(options)

  return (
    <SpotlightContext.Provider value={contextValue}>
      <section
        ref={sectionRef}
        className={cn("relative w-full min-h-dvh overflow-hidden bg-zinc-900 text-zinc-100", className)}
      >
        {children}
      </section>
    </SpotlightContext.Provider>
  )
}

/** @see {@link SpotlightRoot} for full usage docs. */
export const Spotlight = Object.assign(SpotlightRoot, {
  /** @see {@link SpotlightHeading} */
  Heading: SpotlightHeading,
  /** @see {@link SpotlightImages} */
  Images: SpotlightImages,
  /** @see {@link SpotlightMask} */
  Mask: SpotlightMask,
  /** @see {@link SpotlightMaskImage} */
  MaskImage: SpotlightMaskImage,
  /** @see {@link SpotlightMaskHeading} */
  MaskHeading: SpotlightMaskHeading,
})
