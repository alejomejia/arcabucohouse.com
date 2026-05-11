import type { Product } from "@/lib/integrations/shopify/types"

export type ProductCardProps = {
  product: Product
  className?: string
}

export type ProductCardImageProps = {
  /** URL of the primary image shown by default. */
  coverSrc: string
  /** Optional secondary image revealed on hover. When omitted, the hover swap is disabled. */
  backgroundSrc?: string
  /** Accessible name for the cover image — the background is intentionally `aria-hidden`. */
  alt?: string
  className?: string
}
