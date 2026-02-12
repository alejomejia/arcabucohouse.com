"use client"

import type { EmblaOptionsType } from "embla-carousel"
import { useMemo } from "react"

import { LENIS_PREVENT_CLASS } from "@/components/layout/lenis/utils"
import { Carousel } from "@/components/ui/carousel"
import type { Product } from "@/lib/integrations/shopify/types"
import { cn } from "@/lib/utils/helpers"

import { CarouselCursor } from "./carousel-cursor"
import { useProductsCarousel } from "./hooks/use-products-carousel"
import { useProductsCarouselAnimation } from "./hooks/use-products-carousel-animation"
import { useProductsCarouselLayout } from "./hooks/use-products-carousel-layout"
import { ProductSlide } from "./product-slide"

const DESKTOP_OPTIONS: EmblaOptionsType = {
  dragFree: true,
  loop: true,
  align: "center",
  watchDrag: false,
}

const TOUCH_OPTIONS: EmblaOptionsType = {
  dragFree: true,
  loop: true,
  align: "center",
  watchDrag: true,
}

type ProductsCarouselProps = {
  products: Product[]
}

/**
 * Renders a carousel of product-style slides with hover-to-capture wheel and Lenis integration.
 *
 * Client Component — uses useProductsCarousel for hover delay, wheel-to-horizontal scroll,
 * and slide hover scale.
 *
 * @example
 * ```tsx
 * <ProductsCarousel />
 * ```
 */
export function ProductsCarousel({ products }: ProductsCarouselProps) {
  const {
    isActive,
    hoveredIndex,
    isScrolling,
    handleCarouselMouseEnter,
    handleCarouselMouseLeave,
    handleSlideMouseEnter,
    handleSlideMouseLeave,
    onScroll
  } = useProductsCarousel()

  const { slideSize, slideHeight, slideSpacing, isDesktop } = useProductsCarouselLayout()
  const { containerRef, animationEnded } = useProductsCarouselAnimation({
    carouselLayoutKey: slideSize,
  })

  const options = useMemo<EmblaOptionsType>(
    () => (isDesktop ? DESKTOP_OPTIONS : TOUCH_OPTIONS),
    [isDesktop]
  )

  if (!products?.length) return null

  const key = `${slideSize}-${slideHeight}-${slideSpacing}-${isDesktop}`

  // If products length is even, remove the last product
  // We need odd products to keep the animation working as expected
  const oddProducts = products.length % 2 === 0 ? products.slice(0, -1) : products

  return (
    <div
      ref={containerRef}
      className={cn("w-full opacity-0", {
        "pointer-events-none": !animationEnded,
        "pointer-events-auto": animationEnded,
      })}
      onMouseEnter={handleCarouselMouseEnter}
      onMouseLeave={handleCarouselMouseLeave}
    >
      <CarouselCursor isScrolling={!isActive || isScrolling}>
        <Carousel
          key={key}
          className={isDesktop && isActive ? LENIS_PREVENT_CLASS : undefined}
          options={options}
          slideHeight={slideHeight}
          slideSpacing={slideSpacing}
          slideSize={slideSize}
          slideClassName="slide relative z-0 hover:z-10"
          onScroll={isDesktop ? onScroll : undefined}
          enableTouchDrag={!isDesktop}
        >
          {oddProducts.map((product, index) => {
            return (
              <div
                key={product.id}
                className={cn(
                  "slide-wrapper relative flex items-center justify-center",
                  "h-(--slide-height) min-w-0",
                  "select-none",
                  "transition-transform duration-350 ease-in-out",
                  hoveredIndex === index ? "scale-110" : "scale-100",
                )}
                onMouseEnter={() => handleSlideMouseEnter(index)}
                onMouseLeave={handleSlideMouseLeave}
              >
                <ProductSlide className="slide-item" product={product} isFirstSlide={index === 0} />
              </div>
            )
          })}
        </Carousel>
      </CarouselCursor>
    </div>
  )
}

