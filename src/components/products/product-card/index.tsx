"use client"

import { useCursor } from "@/components/effects/cursor/context"
import { CURSOR_MEDIUM } from "@/components/effects/cursor/cursor-states"
import { Link } from "@/components/ui/link"
import type { Product } from "@/lib/integrations/shopify/types"
import { cn } from "@/lib/utils/helpers"

import { ProductCardImage } from "./product-card-image"

type ProductCardProps = {
  product: Product
  className?: string
}

/**
 * Product card with title, cover image, hover image swap, and custom cursor.
 *
 * Returns null if the product has no cover image.
 * `ProductCard.Image` is available as a standalone image block for contexts
 * where the title and link wrapper are handled externally (e.g. a carousel slide).
 *
 * @example
 * ```tsx
 * <ProductCard product={product} />
 * ```
 */
export function ProductCardRoot({ product, className }: ProductCardProps) {
  const { title, handle, images } = product
  const [coverImage, backgroundImage] = images ?? []
  const { setHover, setDefault } = useCursor()

  if (!coverImage?.url) return null

  return (
    <Link
      href={`/product/${handle}`}
      className={cn(className)}
      onMouseEnter={() => setHover(CURSOR_MEDIUM)}
      onMouseLeave={() => setDefault()}
    >
      <h2 className="font-serif italic text-2xl mb-1">{title}</h2>
      <ProductCardImage
        coverSrc={coverImage.url}
        backgroundSrc={backgroundImage?.url}
        alt={title}
      />
    </Link>
  )
}

/** @see {@link ProductCardRoot} for full usage docs. */
export const ProductCard = Object.assign(ProductCardRoot, {
  /** @see {@link ProductCardImage} */
  Image: ProductCardImage,
})

export { ProductCardImage }
