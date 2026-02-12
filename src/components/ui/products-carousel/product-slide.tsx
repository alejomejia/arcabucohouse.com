import type { Product } from "@/lib/integrations/shopify/types"
import { cn } from "@/lib/utils/helpers"

import { Image } from "../image"
import { Link } from "../link"

type ProductSlideProps = {
  /** Optional class name merged with link classes */
  className?: string
  /** Shopify product (handle for URL, first image for thumbnail) */
  product: Product
  /** When true, wraps in slide-mask div for first slide animation */
  isFirstSlide: boolean
}

/**
 * Renders a product slide as a linked thumbnail with brand gradient.
 *
 * Uses the product handle for the URL and the first image for the thumbnail.
 * Returns null if the product has no images. When isFirstSlide is true, wraps
 * in an absolutely positioned slide-mask container for animation clipping.
 *
 * @param props - ProductSlide props
 * @param props.className - Class name merged with link element
 * @param props.product - Shopify product (handle and images)
 * @param props.isFirstSlide - When true: wraps in slide-mask
 */
export function ProductSlide({ className, product, isFirstSlide }: ProductSlideProps) {
  const { handle, images } = product
  const [image] = images

  if (!image) return null

  const { url, altText } = image

  if (isFirstSlide) {
    return (
      <div className="slide-mask absolute inset-0">
        <Link
          href={`/product/${handle}`}
          className={cn("w-full h-full brand-gradient-primary", className)}
        >
          <Image className="h-full mx-auto" src={url} alt={altText} preload />
        </Link>
      </div>
    )
  }

  return (
    <Link
      href={`/product/${handle}`}
      className={cn("w-full h-full brand-gradient-primary", className)}
    >
      <Image id={`product-image--${handle}`} className="h-full mx-auto" src={url} alt={altText} preload />
    </Link>
  )
}