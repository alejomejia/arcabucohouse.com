"use client"

import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel"
import { Children, CSSProperties, type ReactNode, type WheelEvent } from "react"

import { cn } from "@/lib/utils/helpers"

import { useCarousel } from "./use-carousel"

/** Default slide layout values. Use rem or % for consistency with layout. */
export const DEFAULT_SLIDE_HEIGHT = "19rem"
export const DEFAULT_SLIDE_SPACING = "2rem"
export const DEFAULT_SLIDE_SIZE = "20%"

export type CarouselLayout = {
  /** Height of each slide content area. Use CSS length (e.g. `"19rem"`, `"320px"`). */
  slideHeight?: string
  /** Gap between slides. Use CSS length (e.g. `"2rem"`, `"1.5rem"`). */
  slideSpacing?: string
  /** Width of each slide. Use `%` (e.g. `"20%"`) or length for fixed width. */
  slideSize?: string
}

export type CarouselProps = CarouselLayout & {
  /** Optional id for the outer section (e.g. for Lenis scroll prevention). */
  id?: string
  /** One or more nodes; each child becomes one slide. */
  children: ReactNode
  /** Embla carousel options (loop, dragFree, align, etc.). */
  options?: EmblaOptionsType
  /** Class name for the outer section. */
  className?: string
  /** Class name applied to each slide wrapper (flex cell). */
  slideClassName?: string
  /** Callback when the carousel is scrolled (wheel). Omit on tablet/mobile to use drag only. */
  onScroll?: (event: WheelEvent<HTMLElement>, emblaApi: EmblaCarouselType) => void
  /** When true, allows horizontal touch drag (pan-x). Use when wheel scroll is disabled (e.g. tablet/mobile). */
  enableTouchDrag?: boolean
}

/**
 * Renders an Embla-based carousel with customizable layout and slide content.
 *
 * Client Component — uses touch/drag and refs. Each direct child is one slide.
 * Layout is driven by CSS variables so you can reuse the component with different
 * sizes and spacing via `slideHeight`, `slideSpacing`, and `slideSize`.
 *
 * @param children - One or more nodes; each child becomes one slide
 * @param options - Embla options (e.g. loop, dragFree) (default: undefined)
 * @param slideHeight - Height of slide content area (default: "19rem")
 * @param slideSpacing - Gap between slides (default: "2rem")
 * @param slideSize - Width of each slide (default: "20%")
 * @param className - Class name for the section wrapper
 * @param slideClassName - Class name for each slide wrapper
 *
 * @example
 * ```tsx
 * <Carousel options={{ loop: true, dragFree: true }} slideSize="25%" slideSpacing="1.5rem">
 *   <div className="rounded-lg border border-detail-medium-contrast">Slide 1</div>
 *   <div className="rounded-lg border border-detail-medium-contrast">Slide 2</div>
 *   <div className="rounded-lg border border-detail-medium-contrast">Slide 3</div>
 * </Carousel>
 * ```
 */
export function Carousel({
  id,
  children,
  options,
  slideHeight = DEFAULT_SLIDE_HEIGHT,
  slideSpacing = DEFAULT_SLIDE_SPACING,
  slideSize = DEFAULT_SLIDE_SIZE,
  className,
  slideClassName,
  onScroll,
  enableTouchDrag = false,
}: CarouselProps) {
  const { emblaRef, carouselRef } = useCarousel({
    options,
    onScroll,
  })

  const slides = Children.toArray(children)

  const cssVariables = {
    "--slide-height": slideHeight,
    "--slide-spacing": slideSpacing,
    "--slide-size": slideSize,
  } as CSSProperties

  return (
    <div ref={carouselRef} id={id} className={className} style={cssVariables}>
      <div ref={emblaRef} className="overflow-hidden py-10">
        <div
          className={cn(
            "flex gap-[var(--slide-spacing)]",
            enableTouchDrag ? "[touch-action:pan-x_pinch-zoom]" : "[touch-action:pan-y_pinch-zoom]",
            "will-change-transform"
          )}
        >
          {slides.map((child, index) => (
            <div
              key={index}
              className={cn(
                "min-w-0 [flex:0_0_var(--slide-size)]",
                "last:mr-[var(--slide-spacing)]",
                slideClassName
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
