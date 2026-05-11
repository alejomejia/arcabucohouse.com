"use client"

import type { ReactNode } from "react"

import type { Product } from "@/lib/integrations/shopify/types"
import { cn } from "@/lib/utils/helpers"

import { ProductCarouselHeading } from "./product-carousel-heading"
import { ProductCarouselPagination } from "./product-carousel-pagination"
import { ProductCarouselSlide } from "./product-carousel-slide"
import { ProductCarouselViewport } from "./product-carousel-viewport"
import { ProductCarouselContext } from "./product-carousel.context"
import { useProductCarousel } from "./use-product-carousel"

type ProductCarouselProps = {
  products: Product[]
  autoScrollSpeed?: number
  className?: string
  children: ReactNode
  debug?: boolean
}

/**
 * Root of the `ProductCarousel` compound component. Owns carousel state
 * via {@link useProductCarousel} and distributes it through context to
 * `Heading`, `Viewport`, `Slide`, and `Pagination` sub-components.
 *
 * Renders `null` when `products` is empty — the heavy hook never runs in
 * that case so empty rails are zero-cost.
 *
 * @example
 * ```tsx
 * <ProductCarousel products={featuredProducts}>
 *   <ProductCarousel.Heading />
 *   <ProductCarousel.Viewport>
 *     {featuredProducts.map((p, i) => (
 *       <ProductCarousel.Slide key={p.handle} index={i} product={p} />
 *     ))}
 *   </ProductCarousel.Viewport>
 *   <ProductCarousel.Pagination />
 * </ProductCarousel>
 * ```
 */
function ProductCarouselRoot(props: ProductCarouselProps) {
  if (props.products.length === 0) return null
  return <ProductCarouselContent {...props} />
}

function ProductCarouselContent({
  products,
  autoScrollSpeed,
  className,
  children,
  debug,
}: ProductCarouselProps) {
  const carousel = useProductCarousel({ products, autoScrollSpeed, debug })

  return (
    <ProductCarouselContext value={{ products, ...carousel }}>
      <div className={cn("flex flex-col gap-8", className)}>
        {children}
      </div>
    </ProductCarouselContext>
  )
}

/** @see {@link ProductCarouselRoot} for full usage docs. */
export const ProductCarousel = Object.assign(ProductCarouselRoot, {
  /** @see {@link ProductCarouselHeading} */
  Heading: ProductCarouselHeading,
  /** @see {@link ProductCarouselPagination} */
  Pagination: ProductCarouselPagination,
  /** @see {@link ProductCarouselViewport} */
  Viewport: ProductCarouselViewport,
  /** @see {@link ProductCarouselSlide} */
  Slide: ProductCarouselSlide,
})
