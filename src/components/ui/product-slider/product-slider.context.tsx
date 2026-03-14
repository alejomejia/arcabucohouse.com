"use client"

import { createContext, use, type MouseEvent, type PointerEvent, type ReactNode, type RefObject } from "react"

import type { Product } from "@/lib/integrations/shopify/types"

import type { ProgressLine } from "./product-slider.utils"
import { useProductSlider } from "./use-product-slider"

type ProductSliderContextValue = {
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

const ProductSliderContext = createContext<ProductSliderContextValue | null>(null)

type ProductSliderProviderProps = {
  products: Product[]
  autoScrollSpeed?: number
  debug?: boolean
  children: ReactNode
}

/**
 * Provides slider state and refs to all `ProductSlider` sub-components.
 *
 * Calls `useProductSlider` internally — mount once per slider instance.
 *
 * @param products - Product list forwarded to `useProductSlider`.
 * @param autoScrollSpeed - Auto-scroll speed in px/frame (default: 0.5).
 */
export function ProductSliderProvider({
  products,
  autoScrollSpeed,
  debug,
  children,
}: ProductSliderProviderProps) {
  const slider = useProductSlider({ products, autoScrollSpeed, debug })

  return (
    <ProductSliderContext value={{ products, ...slider }}>
      {children}
    </ProductSliderContext>
  )
}

/**
 * Returns the nearest `ProductSliderContext` value.
 *
 * @throws When called outside of a `<ProductSlider>` tree.
 */
export function useProductSliderContext() {
  const context = use(ProductSliderContext)
  if (!context) {
    throw new Error("ProductSlider compound components must be used within <ProductSlider>")
  }
  return context
}
