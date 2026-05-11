"use client"

import { createContext, use, type MouseEvent, type PointerEvent, type RefObject } from "react"

import type { Product } from "@/lib/integrations/shopify/types"

import type { ProgressLine } from "./product-carousel.utils"

export type ProductCarouselContextValue = {
  products: Product[]
  sliderRef: RefObject<HTMLDivElement | null>
  containerRef: RefObject<HTMLDivElement | null>
  setItemRef: (index: number) => (el: HTMLDivElement | null) => void
  categoryRef: RefObject<HTMLSpanElement | null>
  titleRef: RefObject<HTMLHeadingElement | null>
  activeIndexRef: RefObject<HTMLSpanElement | null>
  setLineRef: (index: number) => (el: HTMLDivElement | null) => void
  initialLines: ProgressLine[]
  isGrabbing: boolean
  showCursorDrag: boolean
  onPointerDown: (e: PointerEvent) => void
  onPointerMove: (e: PointerEvent) => void
  onPointerUp: () => void
  onLostPointerCapture: () => void
  onClickCapture: (e: MouseEvent) => void
  debug: boolean
}

/**
 * Internal context distributing carousel state and DOM refs from the
 * `<ProductCarousel>` root to its sub-components.
 */
export const ProductCarouselContext = createContext<ProductCarouselContextValue | null>(null)

/**
 * Consume `ProductCarouselContext`. Throws when rendered outside a
 * `<ProductCarousel>` tree.
 *
 * @throws when called outside `<ProductCarousel>`.
 *
 * @example
 * ```tsx
 * function CarouselDot() {
 *   const { isGrabbing } = useProductCarouselContext()
 *   return <span data-grabbing={isGrabbing} />
 * }
 * ```
 */
export function useProductCarouselContext(): ProductCarouselContextValue {
  const context = use(ProductCarouselContext)
  if (!context) {
    throw new Error("ProductCarousel compound components must be used within <ProductCarousel>")
  }
  return context
}
