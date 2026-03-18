'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, type RefObject } from 'react'

/** DOM refs consumed by the CinemaScroll animation and distributed via context. */
export type CinemaScrollRefs = {
  /** Outermost wrapper — used as the GSAP scope and animated background target. */
  containerRef: RefObject<HTMLDivElement | null>
  /** Marquee section wrapper — ScrollTrigger trigger for the parallax strip. */
  marqueeRef: RefObject<HTMLDivElement | null>
  /** Inner images strip — translated horizontally as the marquee scrolls in. */
  marqueeImagesRef: RefObject<HTMLDivElement | null>
  /** Horizontal scroll section — pinned for the scroll budget. */
  horizontalScrollRef: RefObject<HTMLElement | null>
  /** Flex wrapper containing the spacer + panels — driven by `xPercent`. */
  horizontalWrapperRef: RefObject<HTMLDivElement | null>
  /** The single marquee image that expands to fill the viewport on scroll. */
  pinImgRef: RefObject<HTMLImageElement | null>
}

/**
 * Core animation hook for the CinemaScroll effect.
 *
 * Sets up four GSAP ScrollTriggers:
 * 1. **Marquee parallax** — the image strip drifts right as the marquee scrolls into view.
 * 2. **Clone creation** — a fixed `<img>` clone of the pin image is appended to `document.body`
 *    once the marquee reaches the top of the viewport.
 * 3. **Horizontal pin** — the panel section is pinned for `5 × window.innerHeight` of scroll budget.
 * 4. **Main animation** — drives background color, the clone expand (via `gsap.fromTo`), and the
 *    horizontal panel slide across the full scroll budget.
 *
 * @param startColor - CSS color value for the section background before the animation.
 * @param endColor   - CSS color value for the section background after the animation.
 */
export function useCinemaScroll(startColor: string, endColor: string): CinemaScrollRefs {
  const containerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeImagesRef = useRef<HTMLDivElement>(null)
  const horizontalScrollRef = useRef<HTMLElement>(null)
  const horizontalWrapperRef = useRef<HTMLDivElement>(null)
  const pinImgRef = useRef<HTMLImageElement>(null)

  // Mutable animation state — not reactive, lives only inside GSAP callbacks
  const cloneRef = useRef<HTMLImageElement>(null)
  const isCloneActiveRef = useRef(false)
  const flipAnimRef = useRef<gsap.core.Tween | null>(null)

  useGSAP(() => {
    if (
      !containerRef.current ||
      !marqueeRef.current ||
      !marqueeImagesRef.current ||
      !horizontalScrollRef.current ||
      !horizontalWrapperRef.current
    ) return

    // Explicitly reset all elements to their initial visual state.
    // This is a safety net for Next.js Router Cache: the component may be
    // restored from cache without unmounting, leaving stale GSAP inline styles.
    gsap.set(containerRef.current, { backgroundColor: startColor })
    gsap.set(horizontalWrapperRef.current, { xPercent: 0 })
    if (pinImgRef.current) gsap.set(pinImgRef.current, { clearProps: 'opacity' })

    // Remove any dangling clone left over from a cached session.
    if (isCloneActiveRef.current) {
      cloneRef.current?.remove()
      cloneRef.current = null
      isCloneActiveRef.current = false
    }
    flipAnimRef.current?.kill()
    flipAnimRef.current = null

    // Let GSAP own the transform pipeline from the start
    gsap.set(marqueeImagesRef.current, { xPercent: -75, yPercent: -50 })

    // Derive panel count from the wrapper's children at setup time.
    // The first child is always the spacer div, the rest are panels.
    const panelCount  = horizontalWrapperRef.current.children.length - 1
    const endXPercent = -(panelCount / (panelCount + 1)) * 100

    // Scroll budget scales with the number of panels:
    //   • 3 vh per panel for the horizontal slide phase (20 %–95 % of progress)
    //   • 1 vh for the expand phase (0–20 %)
    //   • 0.5 vh of overshoot so the last panel fully settles before unpinning
    const scrollBudget = window.innerHeight * (1 + panelCount * 3 + 0.5)

    // ── Clone helpers ──
    function createClone() {
      if (isCloneActiveRef.current || !pinImgRef.current) return

      const el = pinImgRef.current
      const rect = el.getBoundingClientRect()
      const clone = el.cloneNode(true) as HTMLImageElement

      cloneRef.current = clone

      gsap.set(clone, {
        position: 'fixed',
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        margin: 0,
        transformOrigin: 'center center',
        pointerEvents: 'none',
        willChange: 'transform',
        zIndex: 10,
      })

      document.body.appendChild(clone)
      gsap.set(el, { opacity: 0 })
      isCloneActiveRef.current = true
    }

    function removeClone() {
      if (!isCloneActiveRef.current) return
      cloneRef.current?.remove()
      cloneRef.current = null
      if (pinImgRef.current) gsap.set(pinImgRef.current, { opacity: 1 })
      isCloneActiveRef.current = false
    }

    // Marquee parallax: strip drifts right as it scrolls into view
    const stMarqueeParallax = ScrollTrigger.create({
      trigger: marqueeRef.current,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: ({ progress }) => {
        gsap.set(marqueeImagesRef.current, { xPercent: -75 + progress * 25 })
      },
    })

    // Create the fixed clone once the marquee pins at the viewport top
    const stClone = ScrollTrigger.create({
      trigger: marqueeRef.current,
      start: 'top top',
      onEnter: createClone,
      onEnterBack: createClone,
      onLeaveBack: removeClone,
    })

    // Pin the horizontal section for the scroll budget
    const stPin = ScrollTrigger.create({
      trigger: horizontalScrollRef.current,
      start: 'top top',
      end: () => `+=${scrollBudget}`,
      pin: true,
    })

    // Main scroll-driven animation
    const stMain = ScrollTrigger.create({
      trigger: horizontalScrollRef.current,
      start: 'top 50%',
      end: () => `+=${scrollBudget}`,

      onLeaveBack() {
        flipAnimRef.current?.kill()
        flipAnimRef.current = null
        gsap.set(containerRef.current, { backgroundColor: startColor })
        gsap.set(horizontalWrapperRef.current, { xPercent: 0 })

        // Reset the clone back to the pin image's current rect so the next
        // forward pass starts from the correct small state.
        if (cloneRef.current && pinImgRef.current) {
          const rect = pinImgRef.current.getBoundingClientRect()
          gsap.set(cloneRef.current, {
            x: 0, xPercent: 0, y: 0, yPercent: 0,
            left:   rect.left,
            top:    rect.top,
            width:  rect.width,
            height: rect.height,
          })
        }
      },

      onUpdate({ progress }) {
        // Expand animation initialized lazily so the "from" transform and the
        // first .progress() call are both applied in the same callback frame —
        // no gap for a blank paint to slip through.
        if (!flipAnimRef.current && cloneRef.current && isCloneActiveRef.current) {
          const el = cloneRef.current
          const rect = el.getBoundingClientRect()

          // Place the clone at full viewport first
          gsap.set(el, {
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100svh',
            x: 0,
            xPercent: 0,
            y: 0,
            yPercent: 0,
            rotation: 0,
          })

          // Compute the x/y/scale that makes the full-viewport clone *look*
          // like it's sitting in the small marquee rect.
          const vw = window.innerWidth
          const vh = window.innerHeight
          const fromX = (rect.left + rect.width  / 2) - vw / 2
          const fromY = (rect.top  + rect.height / 2) - vh / 2
          const scaleX = rect.width  / vw
          const scaleY = rect.height / vh

          // gsap.fromTo immediately applies the "from" values when created
          // (even when paused), so there is no blank frame between setup and
          // the first .progress() call below.
          flipAnimRef.current = gsap.fromTo(
            el,
            { x: fromX, y: fromY, scaleX, scaleY },
            { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1, ease: 'none', paused: true },
          )
        }

        // Background: startColor → endColor over the first 5 %
        gsap.set(containerRef.current, {
          backgroundColor: progress <= 0.05
            ? gsap.utils.interpolate(startColor, endColor, progress / 0.05)
            : endColor,
        })

        // Expand drives over the first 20 % of progress
        if (flipAnimRef.current) {
          flipAnimRef.current.progress(Math.min(progress / 0.2, 1))
        }

        // Horizontal slide + background-image parallax: 20 % → 95 %
        if (progress > 0.2 && progress <= 0.95) {
          const h = (progress - 0.2) / 0.75
          gsap.set(horizontalWrapperRef.current, { xPercent: endXPercent * h })
          if (cloneRef.current) gsap.set(cloneRef.current, { xPercent: -200 * h })
        } else if (progress > 0.95) {
          gsap.set(horizontalWrapperRef.current, { xPercent: endXPercent })
          if (cloneRef.current) gsap.set(cloneRef.current, { xPercent: -200 })
        }
      },
    })

    return () => {
      // Kill each ScrollTrigger with revert=true so inline styles added by
      // the pin trigger (position, top, etc.) are fully removed from the DOM.
      stMarqueeParallax.kill(true)
      stClone.kill(true)
      stPin.kill(true)
      stMain.kill(true)

      // Clear all inline styles applied by GSAP callbacks so that cached
      // components don't carry stale visual state into the next session.
      if (containerRef.current) gsap.set(containerRef.current, { clearProps: 'backgroundColor' })
      if (horizontalWrapperRef.current) gsap.set(horizontalWrapperRef.current, { clearProps: 'xPercent,transform' })
      if (pinImgRef.current) gsap.set(pinImgRef.current, { clearProps: 'opacity' })

      flipAnimRef.current?.kill()
      cloneRef.current?.remove()
      cloneRef.current         = null
      isCloneActiveRef.current = false
      flipAnimRef.current      = null
    }
  }, { scope: containerRef })

  return {
    containerRef,
    marqueeRef,
    marqueeImagesRef,
    horizontalScrollRef,
    horizontalWrapperRef,
    pinImgRef,
  }
}
