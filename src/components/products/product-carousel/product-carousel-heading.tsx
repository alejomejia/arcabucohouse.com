"use client"

import { Text } from "@/components/ui/text"
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
    <div className={cn("w-full flex flex-col gap-8 items-center select-none", className)}>
      <div className="flex flex-col items-center gap-1">
        <Text ref={categoryRef} preset="small" className="text-zinc-500">
          {categoryTitle}
        </Text>
        <Text ref={titleRef} as="h3" className="text-5xl uppercase tracking-wider">
          {firstProduct.title}
        </Text>
      </div>
      <div className="flex justify-center">
        <div className="w-px h-12 bg-zinc-300" />
      </div>
    </div>
  )
}
