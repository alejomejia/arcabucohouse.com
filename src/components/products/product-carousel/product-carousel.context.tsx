"use client"

import { createContext, use, type MouseEvent, type PointerEvent, type ReactNode, type RefObject } from "react"

import type { Product } from "@/lib/integrations/shopify/types"

import type { ProgressLine } from "./product-carousel.utils"
import { useProductCarousel } from "./use-product-carousel"

type ProductCarouselContextValue = {
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

const ProductCarouselContext = createContext<ProductCarouselContextValue | null>(null)

type ProductCarouselProviderProps = {
  products: Product[]
  autoScrollSpeed?: number
  debug?: boolean
  children: ReactNode
}

/**
 * Provides carousel state and refs to all `ProductCarousel` sub-components.
 *
 * Calls `useProductCarousel` internally — mount once per carousel instance.
 *
 * @param products - Product list forwarded to `useProductCarousel`.
 * @param autoScrollSpeed - Auto-scroll speed in px/frame (default: 0.5).
 */
export function ProductCarouselProvider({
  products,
  autoScrollSpeed,
  debug,
  children,
}: ProductCarouselProviderProps) {
  const carousel = useProductCarousel({ products, autoScrollSpeed, debug })

  return (
    <ProductCarouselContext value={{ products, ...carousel }}>
      {children}
    </ProductCarouselContext>
  )
}

/**
 * Returns the nearest `ProductCarouselContext` value.
 *
 * @throws When called outside of a `<ProductCarousel>` tree.
 */
export function useProductCarouselContext() {
  const context = use(ProductCarouselContext)
  if (!context) {
    throw new Error("ProductCarousel compound components must be used within <ProductCarousel>")
  }
  return context
}
