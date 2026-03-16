"use client"

import { useState } from "react"

import { Image } from "@/components/ui/image"
import { cn } from "@/lib/utils/helpers"

type ProductCardImageProps = {
  coverSrc: string
  backgroundSrc?: string
  alt?: string
  className?: string
}

/**
 * Product cover image with optional hover swap to a secondary image.
 *
 * When `backgroundSrc` is provided, hovering the image fades the cover out
 * to reveal the background behind it. The background is always rendered in
 * the DOM so it is already decoded when the hover occurs.
 *
 * @example
 * ```tsx
 * <ProductCardImage
 *   coverSrc={product.images[0].url}
 *   backgroundSrc={product.images[1]?.url}
 *   alt={product.title}
 * />
 * ```
 */
export function ProductCardImage({ coverSrc, backgroundSrc, alt, className }: ProductCardImageProps) {
  const [isHover, setIsHover] = useState(false)
  const hasBackgroundImage = !!backgroundSrc

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => hasBackgroundImage && setIsHover(true)}
      onMouseLeave={() => hasBackgroundImage && setIsHover(false)}
    >
      <Image
        className={cn(
          "relative z-10 w-full",
          "brand-gradient-primary",
          "transition-opacity duration-1000 ease-in-out",
          isHover ? "opacity-0" : "opacity-100",
        )}
        src={coverSrc}
        alt={alt ?? ""}
      />
      {hasBackgroundImage && (
        <Image
          className="absolute inset-0 z-0 w-full brand-gradient-primary"
          src={backgroundSrc}
          alt=""
          aria-hidden
        />
      )}
    </div>
  )
}
