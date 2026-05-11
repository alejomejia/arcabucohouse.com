"use client";

import {
  createContext,
  useContext,
  type RefObject,
} from "react";

/**
 * Refs provided by Spotlight.Root and consumed by compound subcomponents for scroll animation.
 *
 * @property sectionRef - Pinned section element (ScrollTrigger target)
 * @property imagesRef - Scrolling image grid container (y translation 0–50%)
 * @property maskContainerRef - Mask wrapper (mask-size animated 25–75%)
 * @property maskImageRef - Banner image wrapper (scale 1.5 → 1)
 * @property maskHeaderRef - Mask headline element (SplitText word reveal 75–95%)
 */
export type SpotlightContextValue = {
  sectionRef: RefObject<HTMLElement | null>;
  imagesRef: RefObject<HTMLDivElement | null>;
  maskContainerRef: RefObject<HTMLDivElement | null>;
  maskImageRef: RefObject<HTMLDivElement | null>;
  maskHeaderRef: RefObject<HTMLDivElement | null>;
};

/** React context holding spotlight refs. Provided by Spotlight.Root, consumed by Spotlight.* subcomponents. */
export const SpotlightContext = createContext<SpotlightContextValue | null>(null);

/**
 * Returns the spotlight refs from context.
 *
 * Use only inside Spotlight.Root. Subcomponents (Images, Mask, MaskImage, MaskHeading) use it
 * to attach their refs for the GSAP scroll animation.
 *
 * @returns The current spotlight context value (refs)
 * @throws {Error} When used outside Spotlight.Root
 *
 * @example
 * ```tsx
 * function SpotlightImages() {
 *   const { imagesRef } = useSpotlightContext();
 *   return <div ref={imagesRef}>...</div>;
 * }
 * ```
 */
export function useSpotlightContext() {
  const ctx = useContext(SpotlightContext);
  if (!ctx) {
    throw new Error(
      "Spotlight compound components must be used within Spotlight.Root"
    );
  }
  return ctx;
}
