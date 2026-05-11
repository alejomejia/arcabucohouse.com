"use client"

import { CURSOR_MEDIUM } from "@/components/effects/cursor/cursor-states"
import { useCursor } from "@/components/effects/cursor/cursor.context"
import { Link } from "@/components/ui/link"
import { Text } from "@/components/ui/text"
import { trackProductClick } from "@/lib/integrations/umami/events"
import { cn } from "@/lib/utils/helpers"

import { ProductCardImage } from "./product-card-image"
import type { ProductCardProps } from "./product-card.types"

/**
 * Product card with title, cover image, hover image swap, and custom cursor.
 *
 * Returns `null` if the product has no cover image.
 * `ProductCard.Image` is exposed for contexts that need the image block
 * alone (e.g. a carousel slide that provides its own link wrapper).
 *
 * @example
 * ```tsx
 * <ProductCard product={product} />
 * ```
 */
function ProductCardRoot({ product, className }: ProductCardProps) {
  const { title, handle, images, priceRange } = product
  const [coverImage, backgroundImage] = images ?? []
  const { setHover, setDefault } = useCursor()

  if (!coverImage?.url) return null

  const handleClick = () => {
    trackProductClick({
      handle,
      title,
      price: priceRange?.minVariantPrice?.amount,
      currency: priceRange?.minVariantPrice?.currencyCode,
    })
  }

  return (
    <Link
      href={`/product/${handle}`}
      className={cn(className)}
      onClick={handleClick}
      onMouseEnter={() => setHover(CURSOR_MEDIUM)}
      onMouseLeave={() => setDefault()}
    >
      <Text as="h2" preset="h5" className="mb-3 text-zinc-500 tracking-wider uppercase">{title}</Text>
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

export type * from "./product-card.types"
