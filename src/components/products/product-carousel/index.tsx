"use client"

import type { ReactNode } from "react";

import type { Product } from "@/lib/integrations/shopify/types";

import { ProductCarouselHeading } from "./product-carousel-heading";
import { ProductCarouselPagination } from "./product-carousel-pagination";
import { ProductCarouselSlide } from "./product-carousel-slide";
import { ProductCarouselViewport } from "./product-carousel-viewport";
import { ProductCarouselProvider } from "./product-carousel.context";

import { cn } from "@/lib/utils/helpers";

type ProductCarouselProps = {
  products: Product[]
  autoScrollSpeed?: number
  className?: string
  children: ReactNode
  debug?: boolean
}

/**
 * Root client component of the `ProductCarousel` compound component.
 *
 * Wraps sub-components with `ProductCarouselProvider`. Renders nothing when `products` is empty.
 *
 * @param products - Products to display. Renders nothing when empty.
 * @param autoScrollSpeed - Auto-scroll speed in px/frame (default: 0.5).
 *
 * @example
 * ```tsx
 * <ProductCarousel products={featuredProducts}>
 *   <ProductCarousel.Heading />
 *   <ProductCarousel.Viewport>
 *     {products.map((p, i) => (
 *       <ProductCarousel.Slide key={p.handle} index={i} product={p} />
 *     ))}
 *   </ProductCarousel.Viewport>
 *   <ProductCarousel.Pagination />
 * </ProductCarousel>
 * ```
 */
export function ProductCarouselRoot({
  products,
  autoScrollSpeed,
  className,
  children,
  debug,
}: ProductCarouselProps) {
  if (products.length === 0) return null

  return (
    <ProductCarouselProvider products={products} autoScrollSpeed={autoScrollSpeed} debug={debug}>
      <div className={cn("flex flex-col gap-8", className)}>
        {children}
      </div>
    </ProductCarouselProvider>
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
  Slide: ProductCarouselSlide
})

export { ProductCarouselHeading, ProductCarouselPagination, ProductCarouselViewport, ProductCarouselSlide }
