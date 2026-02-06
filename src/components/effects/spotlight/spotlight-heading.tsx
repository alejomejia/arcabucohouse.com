import type { ReactNode } from "react";

import { cn } from "@/lib/utils/helpers";

/**
 * Props for the main spotlight heading (above the image grid).
 *
 * @property className - Optional extra class names for the wrapper
 * @property children - Heading content (e.g. title text or an h1/h2)
 */
type SpotlightHeadingProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Centered heading shown over the spotlight image grid before the mask reveal.
 *
 * Use inside Spotlight.Root. Positioned at the center of the viewport with z-10.
 * This is the initial title (e.g. "Where Frames Fade Into Fate"), not the mask headline.
 *
 * @param className - Optional classes for the centering wrapper
 * @param children - Heading content
 *
 * @example
 * ```tsx
 * <Spotlight.Root>
 *   <Spotlight.Heading>
 *     <h2 className="uppercase text-8xl font-black">Where Frames Fade Into Fate</h2>
 *   </Spotlight.Heading>
 * </Spotlight.Root>
 * ```
 */
export function SpotlightHeading({ className, children }: SpotlightHeadingProps) {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
      className
    )}
    >
      {children}
    </div>
  )
}