import gsap from "gsap"
import { SplitText as GSAPSplitText } from "gsap/SplitText"
import { useCallback, type RefObject } from "react"

import { PRELOADER_CLIP_PATH, PRELOADER_TIMING } from "../preloader.const"

type UsePreloaderTimelineOptions = {
  containerRef: RefObject<HTMLDivElement | null>
  progressContainerRef: RefObject<HTMLDivElement | null>
  progressRef: RefObject<HTMLSpanElement | null>
  counterRef: RefObject<{ value: number }>
  /** Called when the full preloader animation completes. */
  onComplete: () => void
}

/**
 * Returns a callback that builds the preloader GSAP timeline given the
 * SplitText `lines`. Pass the callback to `<SplitText onReady={…}>`.
 *
 * Sequence:
 * 1. Description lines fade up (staggered).
 * 2. Counter 0 → 100 with scale-up in parallel.
 * 3. Digit slide-out via GSAPSplitText.
 * 4. Clip-path collapse reveal.
 *
 * Animations live inside the SplitText context, so they're cleaned up
 * automatically on unmount.
 *
 * @example
 * ```tsx
 * const handleReady = usePreloaderTimeline({
 *   containerRef, progressContainerRef, progressRef, counterRef,
 *   onComplete: markReady,
 * })
 * <SplitText type="lines" onReady={handleReady}>…</SplitText>
 * ```
 */
export function usePreloaderTimeline({
  containerRef,
  progressContainerRef,
  progressRef,
  counterRef,
  onComplete,
}: UsePreloaderTimelineOptions) {
  return useCallback(
    (lines: HTMLElement[]) => {
      const container = containerRef.current
      const progressContainer = progressContainerRef.current
      const progressEl = progressRef.current

      if (!container || !progressContainer || !progressEl) return

      const counter = counterRef.current

      const tl = gsap.timeline({ onComplete })

      tl.set(container, { clipPath: PRELOADER_CLIP_PATH.initial })

      tl.fromTo(
        lines,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "gentleSlow",
          stagger: PRELOADER_TIMING.descriptionStagger,
          duration: PRELOADER_TIMING.descriptionDuration,
        },
        0,
      )

      tl.to(
        counter,
        {
          value: 100,
          duration: PRELOADER_TIMING.counterDuration,
          ease: "power3.out",
          onUpdate: () => {
            progressEl.textContent = Math.floor(counter.value).toString()
          },
          onComplete: () => {
            const split = new GSAPSplitText(progressEl, {
              type: "chars",
              charsClass: "digit",
              mask: "chars",
            })

            gsap.to(split.chars, {
              x: "-100%",
              duration: PRELOADER_TIMING.digitSlideDuration,
              ease: "power3.out",
              stagger: PRELOADER_TIMING.digitSlideStagger,
              delay: PRELOADER_TIMING.digitSlideDelay,
            })
          },
        },
        0.5,
      )

      tl.to(
        progressContainer,
        {
          scale: 1,
          duration: PRELOADER_TIMING.scaleDuration,
          ease: "power3.out",
        },
        0.5,
      )

      tl.to(
        container,
        {
          clipPath: PRELOADER_CLIP_PATH.final,
          duration: PRELOADER_TIMING.revealDuration,
          ease: "power3.inOut",
        },
        "counterComplete+=1.5",
      )
    },
    [containerRef, progressContainerRef, progressRef, counterRef, onComplete],
  )
}
