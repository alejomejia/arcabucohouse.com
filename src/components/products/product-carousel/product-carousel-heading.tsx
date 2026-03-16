"use client"

import { cn } from "@/lib/utils/helpers"

import { useProductCarouselContext } from "./product-carousel.context"

type HeadingProps = {
  className?: string
}

/**
 * Displays the active product's category label and title.
 *
 * Client Component — renders the first product on initial paint, then updates
 * text imperatively via DOM refs on scroll (no re-renders).
 *
 * @example
 * ```tsx
 * <ProductCarousel products={products}>
 *   <ProductCarouselHeading />
 * </ProductCarousel>
 * ```
 */
export function ProductCarouselHeading({ className }: HeadingProps) {
  const { categoryRef, titleRef, products } = useProductCarouselContext()
  const firstProduct = products[0]!
  const categoryTitle = firstProduct.category?.title

  return (
    <div className={cn("w-full flex flex-col gap-2 items-center select-none", className)}>
      <div className="flex flex-col items-center gap-1">
        <span className="text-md text-primary-300">
          <span>[</span>
          <span ref={categoryRef}>{categoryTitle}</span>
          <span>]</span>
        </span>
        <h3 className="text-5xl italic" ref={titleRef}>
          {firstProduct.title}
        </h3>
      </div>
      <div className="flex justify-center">
        <div className="w-px h-12 bg-primary-200" />
      </div>
    </div>
  )
}
