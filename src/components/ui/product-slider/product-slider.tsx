"use client"

import type { ReactNode } from "react"

import type { Product } from "@/lib/integrations/shopify/types"

import { cn } from "@/lib/utils/helpers"
import { ProductSliderProvider } from "./product-slider.context"

type ProductSliderProps = {
  products: Product[]
  autoScrollSpeed?: number
  className?: string
  children: ReactNode
  debug?: boolean
}

/**
 * Root client component of the `ProductSlider` compound component.
 *
 * Wraps sub-components with `ProductSliderProvider`. Renders nothing when `products` is empty.
 *
 * @param products - Products to display. Renders nothing when empty.
 * @param autoScrollSpeed - Auto-scroll speed in px/frame (default: 0.5).
 *
 * @example
 * ```tsx
 * <ProductSlider products={featuredProducts}>
 *   <ProductSliderHeading />
 *   <ProductSliderViewport>
 *     {products.map((p, i) => (
 *       <ProductSliderSlide key={p.handle} index={i} imageSrc={p.images[0]?.url} />
 *     ))}
 *   </ProductSliderViewport>
 *   <ProductSliderPagination />
 * </ProductSlider>
 * ```
 */
export function ProductSlider({
  products,
  autoScrollSpeed,
  className,
  children,
  debug,
}: ProductSliderProps) {
  if (products.length === 0) return null

  return (
    <ProductSliderProvider products={products} autoScrollSpeed={autoScrollSpeed} debug={debug}>
      <div className={cn("flex flex-col gap-8", className)}>
        {children}
      </div>
    </ProductSliderProvider>
  )
}
