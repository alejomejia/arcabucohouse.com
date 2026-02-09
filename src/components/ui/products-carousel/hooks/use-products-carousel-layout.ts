"use client"

import { useBreakpoint } from "@/lib/hooks/use-breakpoint"
import { useMemo } from "react"

export type ProductsCarouselLayout = {
  slideSize: string
  slideHeight: string
  slideSpacing: string
  /** True when viewport is lg (1024px) and above. Use for scroll vs drag behavior. */
  isDesktop: boolean
}

/**
 * Returns responsive carousel layout (slideSize, slideHeight, slideSpacing) and isDesktop by breakpoint.
 * - lg and up: 5 slides (20%), default height/spacing, isDesktop true (wheel scroll).
 * - md: 3 slides (33.333%), isDesktop false (touch/drag).
 * - below md: 1 slide (90%), isDesktop false (touch/drag).
 */
export function useProductsCarouselLayout(): ProductsCarouselLayout {
  const { isMediumScreen, isLargeScreen } = useBreakpoint()
  return useMemo((): ProductsCarouselLayout => {
    if (isMediumScreen) {
      return {
        slideSize: "50%",
        slideHeight: "70vw",
        slideSpacing: "1rem",
        isDesktop: false,
      }
    }
    if (isLargeScreen) {
      return {
        slideSize: "33.333%",
        slideHeight: "50vw",
        slideSpacing: "1rem",
        isDesktop: false,
      }
    }
    return {
      slideSize: "20%",
      slideHeight: "28vw",
      slideSpacing: "1rem",
      isDesktop: true,
    }
  }, [isMediumScreen, isLargeScreen])
}
