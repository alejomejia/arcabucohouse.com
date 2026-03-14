"use client"

import { useState } from "react"

import { useCursor } from "@/components/effects/cursor/context"
import { CURSOR_MEDIUM } from "@/components/effects/cursor/cursor-states"
import { Image } from "@/components/ui/image"
import { Link } from "@/components/ui/link"
import type { Product } from "@/lib/integrations/shopify/types"
import { cn } from "@/lib/utils/helpers"

type ProductCardProps = {
  product: Product
}

/**
 * Product card link with cover image and optional hover image swap.
 * Returns null if the product doesn't have an image.
 * Integrates with cursor effect and shows a second image on hover when available.
 */
export function ProductCard({ product }: ProductCardProps) {
  const { title, handle, images } = product
  const [coverImage, backgroundImage] = images ?? [null, null]
  const { setHover, setDefault } = useCursor()
  const [isHover, setIsHover] = useState(false)

  if (!coverImage?.url) {
    return null
  }

  const href = `/product/${handle}`
  const hasBackgroundImage = !!backgroundImage?.url

  const handleMouseEnter = () => {
    setHover(CURSOR_MEDIUM)
    if (hasBackgroundImage) {
      setIsHover(true)
    }
  }

  const handleMouseLeave = () => {
    setDefault()
    if (hasBackgroundImage) {
      setIsHover(false)
    }
  }

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="font-serif italic text-2xl mb-1">{title}</h2>
      <div className="relative">
        <Image
          className={cn(
            "relative z-10 w-full",
            "brand-gradient-primary",
            "transition-opacity duration-1000 ease-in-out",
            {
              "opacity-0": isHover,
              "opacity-100": !isHover,
            },
          )}
          src={coverImage.url}
          alt={title}
        />
        {hasBackgroundImage ? (
          <Image
            className={cn(
              "absolute inset-0 z-0 w-full",
              "brand-gradient-primary",
            )}
            src={backgroundImage.url}
            alt=""
            aria-hidden
          />
        ) : null}
      </div>
    </Link>
  )
}