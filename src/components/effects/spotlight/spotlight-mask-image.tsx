"use client";

import { Image, ImageProps } from "@/components/ui/image";
import { cn } from "@/lib/utils/helpers";

import { useSpotlightContext } from "./spotlight-context";

const DEFAULT_IMAGE_SRC =
  "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/spotlight-default-banner.webp";

/** Optional overrides for the inner Image; src/alt come from component props. */
type MaskImagePropsOverrides = Partial<Omit<ImageProps, "src" | "alt">>;

/**
 * Props for the spotlight mask image wrapper.
 *
 * @property src - Image URL (passed to the underlying Image component)
 * @property alt - Accessible alternative text
 * @property className - Optional extra class names for the wrapper div
 * @property imgProps - Optional overrides forwarded to the Image (e.g. className, sizes)
 */
export type SpotlightMaskImageProps = {
  src?: string;
  alt?: string;
  className?: string;
  imgProps?: MaskImagePropsOverrides;
};

/**
 * Wrapper for the banner image inside Spotlight.Mask; receives the ref used for scale animation.
 *
 * Must be used inside Spotlight.Root. The wrapper div is scaled by the scroll
 * animation (1.5 → 1); the inner Image fills it with object-cover.
 *
 * @param src - Image URL for the banner
 * @param alt - Alt text for the image
 * @param className - Optional classes for the wrapper
 * @param imgProps - Optional props spread onto the Image component
 *
 * @example
 * ```tsx
 * <Spotlight.Mask>
 *   <Spotlight.MaskImage src="/spotlight/banner.jpg" alt="Campaign banner" />
 * </Spotlight.Mask>
 * ```
 */
export function SpotlightMaskImage({
  src = DEFAULT_IMAGE_SRC,
  alt = "",
  className,
  imgProps,
}: SpotlightMaskImageProps) {
  const { maskImageRef } = useSpotlightContext();
  const { className: imgClassName, ...imgRest } = imgProps || {};

  return (
    <div ref={maskImageRef} className={cn("w-full h-full origin-center", className)}>
      <Image src={src} alt={alt} className={cn("w-full h-full object-cover", imgClassName)} {...imgRest} />
    </div>
  );
}
