"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { RefObject } from "react"
import { useRef, useState } from "react"

import { getTotalWidth, splitElements } from "./utils"

export const MIN_WRAPPERS = 7
const SLIDE_DURATION = 1.5
const SLIDE_EASE = "power3.inOut"

type UseProductsCarouselAnimationReturn = {
  containerRef: RefObject<HTMLDivElement | null>
  animationEnded: boolean
}

type UseProductsCarouselAnimationParams = {
  /** Layout key (e.g. slideSize) so animation re-runs when Carousel remounts on breakpoint change. */
  carouselLayoutKey: string
}

/**
 * Sets up GSAP layout for the products carousel: z-index by position and
 * horizontal offsets for left/right wrappers so the animation aligns correctly.
 *
 * Requires an odd number of slide wrappers (use loop: true, align: "center" in
 * carousel options). Does nothing if wrapper count is even or below minimum.
 *
 * Re-runs when carouselLayoutKey changes (e.g. responsive layout) so init animation
 * plays on all breakpoints after the Carousel remounts.
 *
 * @param params.carouselLayoutKey - Key that changes with layout (e.g. slideSize) so the effect re-runs
 * @returns Object with containerRef to attach to the carousel container
 *
 * @example
 * ```tsx
 * function ProductsCarousel() {
 *   const layout = useProductsCarouselLayout()
 *   const { containerRef } = useProductsCarouselAnimation({ carouselLayoutKey: layout.slideSize })
 *   return <div ref={containerRef} className="opacity-0">...</div>
 * }
 * ```
 */
export function useProductsCarouselAnimation({
  carouselLayoutKey,
}: UseProductsCarouselAnimationParams): UseProductsCarouselAnimationReturn {
  const [animationEnded, setAnimationEnded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)

  useGSAP(
    () => {
      if (!containerRef.current) return

      setAnimationEnded(false)
      completedRef.current = false

      const slides = gsap.utils.toArray<HTMLDivElement>(".slide", containerRef.current)
      const wrappers = gsap.utils.toArray<HTMLDivElement>(".slide-wrapper", containerRef.current)

      const isInvalidCount =
        wrappers.length === 0 ||
        wrappers.length % 2 === 0 ||
        wrappers.length < MIN_WRAPPERS

      if (isInvalidCount) return

      const master = gsap.timeline({
        onComplete: () => {
          if (completedRef.current) return
          completedRef.current = true

          // Clear all GSAP inline styles so CSS class-based styles work (hover scale, z-index).
          // Without this, inline transform/z-index override Tailwind classes.
          gsap.delayedCall(0.25, () => {
            gsap.set(slides, { clearProps: "z-index" })
            gsap.set(wrappers, { clearProps: "all" })
          })

          setAnimationEnded(true)
        }
      })

      const {
        middle: middleSlide,
        left: leftSlides,
        right: rightSlides
      } = splitElements(slides)

      const {
        left: leftWrappers,
        right: rightWrappers
      } = splitElements(wrappers)

      const middleZ = Math.round(slides.length / 2)

      const hideSlidesAnimation = () => {
        master
        // Middle slide with higher z-index 
        // than left and right slides
          .set(middleSlide, {
            zIndex: middleZ
          })
          .set(leftSlides, {
            zIndex: (i) => middleZ - 1 - i,
            opacity: 0
          })
          .set(rightSlides, {
            zIndex: (i) => middleZ - 1 - i,
            opacity: 0
          })
          // Wrapper initial X offsets
          // All wrappers hidden behind middle slide
          .set(leftWrappers, {
            x: (i, el) => getTotalWidth(el) * (i + 1)
          })
          .set(rightWrappers, {
            x: (i, el) => -getTotalWidth(el) * (i + 1)
          })
          .addLabel("slidesReady", "+=0.25")
      }

      const discoverMiddleSlideAnimation = () => {
        const initialClipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
        const finalClipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"

        master
          .set(containerRef.current, { opacity: 1 }, "slidesReady")
          .set(".slide-mask", { clipPath: initialClipPath })
          .to(".slide-mask", {
            clipPath: finalClipPath,
            duration: 1,
            ease: "power3.inOut"
          })
          .addLabel("middleSlideVisible")
      }

      const discoverSlidesTimeline = () => {
        master
          .set([leftSlides, rightSlides], { opacity: 1 }, "middleSlideVisible")
          .to(
            leftWrappers,
            { x: 0, duration: SLIDE_DURATION, ease: SLIDE_EASE, stagger: { from: "end" } },
            "<"
          )
          .to(
            rightWrappers,
            { x: 0, duration: SLIDE_DURATION, ease: SLIDE_EASE, stagger: { from: "end" } },
            "<"
          )
      }

      hideSlidesAnimation()
      discoverMiddleSlideAnimation()
      discoverSlidesTimeline()
    },
    { scope: containerRef, dependencies: [carouselLayoutKey] }
  )

  return { containerRef, animationEnded }
}