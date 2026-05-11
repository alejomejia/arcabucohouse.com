"use client";

import type { CSSProperties, ReactNode } from "react";

import { SHOPIFY_CDN_ASSETS } from "@/lib/integrations/shopify/config";
import { cn } from "@/lib/utils/helpers";

import { useSpotlightContext } from "./spotlight.context";
import s from "./spotlight.module.css";

/**
 * Props for the Spotlight mask container.
 *
 * @property maskUrl - SVG URL used for the CSS mask (default: Shopify CDN default mask)
 * @property children - Content inside the mask (e.g. MaskImage, MaskHeading)
 * @property className - Optional extra class names
 */
export type SpotlightMaskProps = {
  maskUrl?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Container that applies an SVG mask and hosts the spotlight banner + heading.
 *
 * Must be used inside Spotlight.Root. Attaches the ref used by the scroll
 * animation to drive mask-size and scale. Mask image is set via the
 * --spotlight-mask-url CSS variable.
 *
 * @param maskUrl - SVG URL for the mask shape (default: default Shopify CDN mask)
 * @param children - Typically Spotlight.MaskImage and Spotlight.MaskHeading
 * @param className - Optional additional classes
 *
 * @example
 * ```tsx
 * <Spotlight.Mask maskUrl="/custom-mask.svg">
 *   <Spotlight.MaskImage src="/banner.jpg" alt="" />
 *   <Spotlight.MaskHeading>The Last Frame Hits Hard</Spotlight.MaskHeading>
 * </Spotlight.Mask>
 * ```
 */
export function SpotlightMask({
  maskUrl = SHOPIFY_CDN_ASSETS.VECTOR_SOUTH_AMERICA,
  children,
  className,
}: SpotlightMaskProps) {
  const { maskContainerRef } = useSpotlightContext();

  const style = { "--spotlight-mask-url": `url(${maskUrl})` } as CSSProperties;

  return (
    <div
      ref={maskContainerRef}
      className={cn(
        "absolute top-0 left-0 z-10 w-screen h-dvh overflow-hidden",
        s["spotlight-mask"],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
