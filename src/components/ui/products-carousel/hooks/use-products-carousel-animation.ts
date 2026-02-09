"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { RefObject } from "react"
import { useRef, useState } from "react"

import { usePreloader } from "@/components/ui/preloader/hooks/use-preloader"

import { getTotalWidth, splitElements } from "./utils"

export const MIN_WRAPPERS = 7

const TIMING = {
  slideDuration: 1.5,
  slideEase: "power3.inOut",
  revealDuration: 1,
  revealEase: "power3.inOut",
} as const;

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
 * Waits for the preloader to complete before starting the animation.
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
  const hasPlayedRef = useRef(false)

  const { waitForReady } = usePreloader()

  useGSAP(
    () => {
      if (!containerRef.current) return
      if (hasPlayedRef.current) return

      const runAnimation = () => {
        if (hasPlayedRef.current) return
        if (!containerRef.current) return

        hasPlayedRef.current = true
        setAnimationEnded(false)
        completedRef.current = false

        const container = containerRef.current
        const slides = gsap.utils.toArray<HTMLDivElement>(".slide", container)
        const wrappers = gsap.utils.toArray<HTMLDivElement>(".slide-wrapper", container)

        const isInvalidCount =
          wrappers.length === 0 ||
          wrappers.length % 2 === 0 ||
          wrappers.length < MIN_WRAPPERS

        if (isInvalidCount) return

        const master = gsap.timeline({
          onComplete: () => {
            if (completedRef.current) return
            completedRef.current = true

            // Clear all GSAP inline styles so CSS class-based styles work
            gsap.delayedCall(0.25, () => {
              gsap.set(slides, { clearProps: "z-index" })
              gsap.set(wrappers, { clearProps: "all" })
            })

            setAnimationEnded(true)
          },
        })

        const {
          middle: middleSlide,
          left: leftSlides,
          right: rightSlides,
        } = splitElements(slides)

        const {
          left: leftWrappers,
          right: rightWrappers,
        } = splitElements(wrappers)

        const middleZ = Math.round(slides.length / 2)

        // Hide slides initially
        master
          .set(middleSlide, { zIndex: middleZ })
          .set(leftSlides, {
            zIndex: (i) => middleZ - 1 - i,
            opacity: 0,
          })
          .set(rightSlides, {
            zIndex: (i) => middleZ - 1 - i,
            opacity: 0,
          })
          .set(leftWrappers, {
            x: (i, el) => getTotalWidth(el) * (i + 1),
          })
          .set(rightWrappers, {
            x: (i, el) => -getTotalWidth(el) * (i + 1),
          })
          .addLabel("slidesReady", "+=0.25")

        // Reveal middle slide
        const initialClipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
        const finalClipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"

        master
          .set(container, { opacity: 1 }, "slidesReady")
          .set(".slide-mask", { clipPath: initialClipPath })
          .to(".slide-mask", {
            clipPath: finalClipPath,
            duration: TIMING.revealDuration,
            ease: TIMING.revealEase,
          })
          .addLabel("middleSlideVisible")

        // Reveal side slides
        master
          .set([leftSlides, rightSlides], { opacity: 1 }, "middleSlideVisible")
          .to(
            leftWrappers,
            {
              x: 0,
              duration: TIMING.slideDuration,
              ease: TIMING.slideEase,
              stagger: { from: "end" },
            },
            "<"
          )
          .to(
            rightWrappers,
            {
              x: 0,
              duration: TIMING.slideDuration,
              ease: TIMING.slideEase,
              stagger: { from: "end" },
            },
            "<"
          )
      }

      // Wait for preloader, then run animation
      waitForReady().then(runAnimation)
    },
    { scope: containerRef, dependencies: [carouselLayoutKey] }
  )

  return { containerRef, animationEnded }
}