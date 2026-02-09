"use client"

import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaViewportRefType } from "node_modules/embla-carousel-react"
import { type Ref, useEffect, useEffectEvent, useRef, type WheelEvent } from "react"

export type UseCarouselOptions = {
  /** Embla carousel options (loop, dragFree, align, etc.). */
  options?: EmblaOptionsType
  /** Callback when the carousel is scrolled (e.g. wheel). Uses non-passive listener when provided. */
  onScroll?(event: WheelEvent<HTMLElement>, emblaApi: EmblaCarouselType): void
  /** Height of each slide content area. Use CSS length (e.g. `"19rem"`, `"320px"`). */
  slideHeight?: string
  /** Gap between slides. Use CSS length (e.g. `"2rem"`, `"1.5rem"`). */
  slideSpacing?: string
  /** Width of each slide. Use `%` (e.g. `"20%"`) or length for fixed width. */
  slideSize?: string
}

export type UseCarouselReturn = {
  /** Ref to attach to the Embla viewport (overflow container). */
  emblaRef: EmblaViewportRefType | null
  /** Ref to attach to the outer section (for wheel listener when onScroll is provided). */
  carouselRef: Ref<HTMLDivElement | null>
}

/**
 * Encapsulates Embla carousel setup, wheel-to-scroll handling, and layout CSS variables.
 * Use with a presentational carousel component that renders slides and attaches the refs.
 *
 * @param params - Options and layout overrides
 * @returns Refs and CSS variables for the carousel DOM
 *
 * @example
 * ```tsx
 * const { emblaRef, carouselRef, cssVariables } = useCarousel({
 *   options: { loop: true },
 *   onScroll: (e, api) => { e.preventDefault(); api.scrollBy(e.deltaY) },
 *   slideSize: "25%"
 * })
 * return (
 *   <section ref={carouselRef} style={cssVariables}>
 *     <div ref={emblaRef}>...</div>
 *   </section>
 * )
 * ```
 */
export function useCarousel({
  options,
  onScroll,
}: UseCarouselOptions): UseCarouselReturn {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const carouselRef = useRef<HTMLDivElement>(null)

  const onWheel = useEffectEvent((event: globalThis.WheelEvent) => {
    if (emblaApi) onScroll?.(event as unknown as WheelEvent<HTMLElement>, emblaApi)
  })

  useEffect(() => {
    if (!emblaApi) return
    const section = carouselRef.current
    if (!section) return

    const handleWheel = (event: globalThis.WheelEvent) => {
      onWheel(event)
    }
    
    section.addEventListener("wheel", handleWheel, { passive: false })
    return () => section.removeEventListener("wheel", handleWheel)
  }, [emblaApi])

  return { emblaRef, carouselRef }
}
