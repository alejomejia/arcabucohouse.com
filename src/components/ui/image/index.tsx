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
 * Adds responsive sizing, aspect ratio support, and automatic blur placeholders.
 * Always use this component instead of next/image directly.
 */
export type ImageProps = Omit<NextImageProps, "alt"> & {
  /** Display as block element (adds display: block) */
  block?: boolean;
  /** Size on mobile devices (e.g., "100vw", "50vw") */
  mobileSize?: `${number}vw`;
  /** Size on desktop devices (e.g., "33vw", "25vw") */
  desktopSize?: `${number}vw`;
  /** Ref for accessing the underlying img element */
  ref?: Ref<HTMLImageElement>;
  /** Alt text for accessibility (required for meaningful images) */
  alt?: string;
  /** Aspect ratio for automatic placeholder and layout stability */
  aspectRatio?: number;
};

/**
 * Enhanced Image component with responsive sizing and automatic optimizations.
 *
 * Always use this component instead of next/image directly. Provides:
 * - Automatic responsive sizes generation
 * - Smart blur placeholders with aspect ratio support
 * - Performance optimizations (lazy loading by default)
 * - Priority for LCP images
 *
 * @param props - Image props extending Next.js Image
 * @param props.aspectRatio - Aspect ratio for layout stability and blur placeholder
 * @param props.mobileSize - Size on mobile (e.g., "100vw")
 * @param props.desktopSize - Size on desktop (e.g., "50vw")
 * @param props.block - Display as block element
 * @param props.priority - Enable priority for LCP images
 *
 * @example
 * ```tsx
 * // Basic usage with aspect ratio
 * <Image
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   aspectRatio={16/9}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // LCP image with preload
 * <Image
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   aspectRatio={16/9}
 *   priority // Preloads image for LCP
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Responsive grid image
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
  loading,
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
  priority = false,
  ...props
}: ImageProps) {
  // Determine loading strategy
  const finalLoading = loading ?? (priority ? "eager" : "lazy");

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
      className={cn(className, "object-cover", {
        "block w-auto h-auto": block,


      })}
      sizes={finalSizes}
      src={src}
      unoptimized={unoptimized || isSvg}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      {...(finalPlaceholder && { placeholder: finalPlaceholder })}
      {...(blurDataURL && { blurDataURL })}
      priority={priority}
      {...props}
    />
  );
}
