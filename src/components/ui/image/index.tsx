"use client";

import { cn } from "@/lib/utils/helpers";
import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { Ref } from "react";
import {
  generateBlurDataURL,
  getFinalPlaceholder,
  shouldUseBlurPlaceholder,
} from "./helpers";

/**
 * Enhanced Image component props extending Next.js Image.
 *
 * Adds responsive sizing, aspect ratio support, automatic blur placeholders,
 * and control over loading strategy. Use this component instead of next/image.
 */
export type ImageProps = Omit<NextImageProps, "alt"> & {
  /** Display as block element; when false with fill, uses fill layout (default: true when not fill) */
  block?: boolean;
  /** Size on mobile for responsive sizes, e.g. "100vw", "50vw" (default: "100vw") */
  mobileSize?: `${number}vw`;
  /** Size on desktop for responsive sizes, e.g. "33vw", "25vw" (default: "100vw") */
  desktopSize?: `${number}vw`;
  /** Ref for the underlying img element */
  ref?: Ref<HTMLImageElement>;
  /** Alt text for accessibility */
  alt?: string;
  /** Aspect ratio for layout stability and blur placeholder shape */
  aspectRatio?: number;
  /** Use eager loading for LCP images; when true sets loading="eager" (default: false) */
  preload?: boolean;
};

/**
 * Enhanced Image component with responsive sizes and blur placeholders.
 *
 * Use instead of next/image. Provides:
 * - Responsive sizes from mobileSize/desktopSize (breakpoint at 800px)
 * - Blur placeholders with optional aspect ratio
 * - Lazy loading by default; set preload for LCP images
 * - SVGs passed through unoptimized; drag disabled
 *
 * @param props - Props extending Next.js Image
 * @param props.src - Image URL (required; returns null if missing)
 * @param props.alt - Alt text (default: "")
 * @param props.aspectRatio - Aspect ratio for layout and blur shape
 * @param props.mobileSize - Viewport size on mobile for sizes attribute (default: "100vw")
 * @param props.desktopSize - Viewport size on desktop for sizes attribute (default: "100vw")
 * @param props.block - Block layout when true, fill when false (default: true unless fill)
 * @param props.preload - Eager loading for LCP (default: false)
 * @param props.quality - JPEG/WebP quality (default: 90)
 * @param props.placeholder - "blur" | "empty"; blur uses aspectRatio or blurDataURL when provided (default: "blur")
 *
 * @example
 * ```tsx
 * // Basic with aspect ratio
 * <Image src="/hero.jpg" alt="Hero" aspectRatio={16 / 9} />
 * ```
 *
 * @example
 * ```tsx
 * // LCP image with eager loading
 * <Image src="/hero.jpg" alt="Hero" aspectRatio={16 / 9} preload />
 * ```
 *
 * @example
 * ```tsx
 * // Responsive grid
 * <Image
 *   src="/product.jpg"
 *   alt="Product"
 *   aspectRatio={1}
 *   mobileSize="100vw"
 *   desktopSize="33vw"
 * />
 * ```
 */
export function Image({
  className,
  quality = 90,
  alt = "",
  fill,
  block = !fill,
  width = block ? 1 : undefined,
  height = block ? 1 : undefined,
  mobileSize = "100vw",
  desktopSize = "100vw",
  sizes,
  src,
  unoptimized,
  ref,
  aspectRatio,
  placeholder = "blur",
  preload = false,
  ...props
}: ImageProps) {
  // Determine loading strategy
  const finalLoading = preload ? "eager" : "lazy";

  // Generate responsive sizes if not provided
  const finalSizes =
    sizes || `(max-width: 800px) ${mobileSize}, ${desktopSize}`;

  // Early return after hooks
  if (!src) return null;

  // Determine SVG status and placeholder logic
  const isSvg = typeof src === "string" && src.includes(".svg");

  const shouldUsePlaceholder = shouldUseBlurPlaceholder(
    src,
    placeholder,
    props.blurDataURL,
  );

  const blurDataURL = generateBlurDataURL(
    shouldUsePlaceholder,
    aspectRatio,
    props.blurDataURL,
  );

  const finalPlaceholder = getFinalPlaceholder(
    shouldUsePlaceholder,
    aspectRatio,
    props.blurDataURL,
    placeholder,
  );

  return (
    <NextImage
      ref={ref}
      fill={!block}
      {...(width !== undefined && { width })}
      {...(height !== undefined && { height })}
      loading={finalLoading}
      quality={quality}
      alt={alt}
      className={cn("object-cover", {
        "block w-auto h-auto": block,
      }, className)}
      sizes={finalSizes}
      src={src}
      unoptimized={unoptimized || isSvg}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      {...(finalPlaceholder && { placeholder: finalPlaceholder })}
      {...(blurDataURL && { blurDataURL })}
      {...props}
    />
  );
}
