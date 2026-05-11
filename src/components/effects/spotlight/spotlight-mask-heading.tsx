"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/utils/helpers";

import { useSpotlightContext } from "./spotlight.context";

/**
 * Props for the spotlight mask heading.
 *
 * @property children - Heading content (e.g. text or an h1); receives the ref used for word-by-word reveal
 * @property className - Optional extra class names for the outer wrapper
 */
export type SpotlightMaskHeadingProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Heading inside Spotlight.Mask; receives the ref used for GSAP SplitText word-by-word reveal.
 *
 * Must be used inside Spotlight.Root. The scroll animation reveals words in order
 * between 75% and 95% progress. Content is centered in the mask.
 *
 * @param children - Heading content (typically a single line of text)
 * @param className - Optional classes for the centering wrapper
 *
 * @example
 * ```tsx
 * <Spotlight.Mask>
 *   <Spotlight.MaskImage src="/banner.jpg" alt="" />
 *   <Spotlight.MaskHeading>The Last Frame Hits Hard</Spotlight.MaskHeading>
 * </Spotlight.Mask>
 * ```
 */
export function SpotlightMaskHeading({
  className,
  children,
}: SpotlightMaskHeadingProps) {
  const { maskHeaderRef } = useSpotlightContext();

  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2",
      className
    )}>
      <div ref={maskHeaderRef}>
        {children}
      </div>
    </div>
  );
}
