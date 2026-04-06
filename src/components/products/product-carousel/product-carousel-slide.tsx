"use client"

import Link from "next/link"

import { ProductCardImage } from "@/components/products/product-card"
import type { Product } from "@/lib/integrations/shopify/types"
import { cn } from "@/lib/utils/helpers"

import { useProductCarouselContext } from "./product-carousel.context"

type SlideProps = {
  index: number
  product: Product
  className?: string
  /** @internal Injected by `ProductCarouselViewport` for the duplicate slide set. */
  _indexOffset?: number
}

/**
 * Single slide within `ProductCarouselViewport`.
 *
 * Registers itself in `itemRefs` for per-slide parallax (`--p`) updates.
 * Renders a `ProductCard.Image` for the cover/hover-swap effect.
 * Returns null if the product has no cover image.
 *
 * @param index - Zero-based position in the original product list.
 * @param product - Product to display.
 *
 * @example
 * ```tsx
 * <ProductCarouselViewport>
 *   {products.map((p, i) => (
 *     <ProductCarouselSlide key={p.handle} index={i} product={p} />
 *   ))}
 * </ProductCarouselViewport>
 * ```
 */
export function ProductCarouselSlide({
  index,
  product,
  className,
  _indexOffset = 0,
}: SlideProps) {
  const { setItemRef } = useProductCarouselContext()
  const [coverImage, backgroundImage] = product.images ?? []

  if (!coverImage?.url) return null

  return (
    <div
      className={cn("w-90 aspect-4/3 shrink-0", className)}
      ref={setItemRef(index + _indexOffset)}
      style={{ "--p": "1" } as React.CSSProperties}
    >
      <Link href={`/product/${product.handle}`} className="block overflow-hidden" draggable={false}>
        <ProductCardImage
          coverSrc={coverImage.url}
          backgroundSrc={backgroundImage?.url}
          alt={product.title}
        />
      </Link>
    </div>
  )
}
