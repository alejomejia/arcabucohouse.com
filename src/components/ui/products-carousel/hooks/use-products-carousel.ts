"use client"

import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useRef, useState, type WheelEvent } from "react";

/**
 * Hover duration (ms) before wheel is captured by the carousel;
 * keeps page scroll for quick pass-through.
 */
const HOVER_ACTIVATE_MS = 1000

/**
 * Idle time (ms) after the last wheel event before we consider the carousel "still".
 * Used to expose isScrolling for UI (e.g. custom cursor visibility).
 */
const SCROLL_IDLE_MS = 1000

/**
 * Manages all products-carousel behavior: hover-to-activate wheel, wheel-to-horizontal
 * scroll, and slide hover scale.
 *
 * **1. Hover-to-activate (Lenis)**  
 * Wheel is only captured after the pointer has been over the carousel for
 * HOVER_ACTIVATE_MS. Until then, page scroll works as usual.
 *
 * **2. Wheel-to-horizontal scroll**  
 * When active, vertical wheel delta is mapped to horizontal carousel movement
 * and Lenis page scroll is prevented (caller adds LENIS_PREVENT_CLASS when isActive).
 *
 * **3. Slide hover scale**  
 * Slides scale up when hovered. During wheel scroll we clear hover once (so no stuck scale).
 *
 * **Performance:** Only one setHoveredIndex(null) per scroll session.
 *
 * @returns Handlers and state to wire into the wrapper div, Carousel, and each slide.
 */
export function useProductsCarousel() {
  const [isActive, setIsActive] = useState(false)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Used to scale on mouse enter and leave
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  /**
   * True while the user is actively scrolling (wheel). Becomes false SCROLL_IDLE_MS after
   * the last wheel event. Exposed for UI (e.g. show custom cursor only when still).
   * Only updates when transitioning (max 2 state updates per scroll session).
   */
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Track whether we're currently in a scroll session to avoid calling setHoveredIndex(null)
   * on every wheel tick. We only clear hover once at the start of scroll.
   * Reset when the user hovers a slide so the next wheel will clear hover again.
   */
  const isScrollingRef = useRef(false)

  const handleCarouselMouseEnter = useCallback(() => {
    isScrollingRef.current = false
    hoverTimerRef.current = setTimeout(() => {
      setIsActive(true)
      hoverTimerRef.current = null
    }, HOVER_ACTIVATE_MS)
  }, [])

  const handleCarouselMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setIsActive(false)
  }, [])

  const handleSlideMouseEnter = useCallback((index: number) => {
    isScrollingRef.current = false
    setHoveredIndex(index)
  }, [])

  const handleSlideMouseLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  /**
   * Wheel handler: clear hover once when scroll starts (one setState, not per tick),
   * then run wheel-to-horizontal scroll (and Lenis prevent).
   * Marks isScrolling true on first wheel, and schedules isScrolling false after SCROLL_IDLE_MS.
   */
  const onScroll = useCallback(
    (event: WheelEvent<HTMLElement>, emblaApi: EmblaCarouselType) => {
      // Clear hover scale as soon as wheel starts; only once per scroll session for performance
      if (!isScrollingRef.current) {
        isScrollingRef.current = true
        setHoveredIndex(null)
        setIsScrolling(true)
      }

      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current)
      }

      scrollEndTimerRef.current = setTimeout(() => {
        scrollEndTimerRef.current = null
        isScrollingRef.current = false
        setIsScrolling(false)
      }, SCROLL_IDLE_MS)

      if (!isActive) return

      event.preventDefault()

      const deltaY = event.deltaY
      const engine = emblaApi.internalEngine()

      engine.scrollTo.distance(deltaY, false)
    },
    [isActive]
  )

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current)
    }
  }, [])

  return {
    isActive,
    isScrolling,
    hoveredIndex,
    setHoveredIndex,
    handleCarouselMouseEnter,
    handleCarouselMouseLeave,
    handleSlideMouseEnter,
    handleSlideMouseLeave,
    onScroll,
  }
}
