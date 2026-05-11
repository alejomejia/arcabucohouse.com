"use client"

import gsap from "gsap"
import { TransitionRouter } from "next-transition-router"
import { type ReactNode, type RefObject, startTransition, useCallback, useRef } from "react"

import { Z_INDEX_CLASSNAMES } from "@/lib/styles/const"
import { cn } from "@/lib/utils/helpers"

const ANIMATION_CONFIG = {
  duration: 1,
  ease: "power3.inOut",
}

type PageTransitionVariant = "slide" | "fade"

type PageTransitionProviderProps = {
  children: ReactNode
  /** Visual style of the route transition. @default "fade" */
  variant?: PageTransitionVariant
}

/**
 * Runs a single GSAP route-transition step on `target`: snap to `from`,
 * tween to `to` (with the shared `ANIMATION_CONFIG`), then call `onComplete`.
 * Returns a cleanup that kills the timeline if the route is interrupted.
 */
function runTransition(
  target: RefObject<HTMLDivElement | null>,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  onComplete: () => void,
) {
  gsap.set(target.current, from)
  const tl = gsap.timeline().to(target.current, {
    ...to,
    ...ANIMATION_CONFIG,
    onComplete,
  })
  return () => tl.kill()
}

/**
 * Wraps the app in `next-transition-router` with a GSAP-driven leave/enter
 * sequence. Two variants:
 * - **fade** (default) — full-bleed panel fades in over the outgoing
 *   route, then fades out over the incoming route.
 * - **slide** — panel slides up from the bottom to cover, then continues
 *   off the top to reveal the new route.
 *
 * The `next` callback is invoked inside `startTransition` + a single
 * `requestAnimationFrame` so React commits the new route on the frame
 * after the cover is in place — eliminating the flash of incoming content.
 *
 * @example
 * ```tsx
 * <PageTransitionProvider variant="slide">
 *   {children}
 * </PageTransitionProvider>
 * ```
 */
export function PageTransitionProvider({ children, variant = "fade" }: PageTransitionProviderProps) {
  const transitionRef = useRef<HTMLDivElement>(null)

  const onLeave = useCallback((next: () => void) => {
    const triggerNext = () => requestAnimationFrame(() => startTransition(next))

    if (variant === "fade") {
      return runTransition(transitionRef, { yPercent: -100 }, { opacity: 1 }, triggerNext)
    }

    return runTransition(transitionRef, { opacity: 1, yPercent: 0 }, { yPercent: -100 }, triggerNext)
  }, [variant])

  const onEnter = useCallback((next: () => void) => {
    if (variant === "fade") {
      return runTransition(transitionRef, { yPercent: -100 }, { opacity: 0 }, () => {
        gsap.set(transitionRef.current, { opacity: 0, yPercent: 100 })
        requestAnimationFrame(() => startTransition(next))
      })
    }

    return runTransition(transitionRef, { opacity: 1, yPercent: -100 }, { yPercent: -200 }, () => {
      gsap.set(transitionRef.current, { yPercent: 0 })
      requestAnimationFrame(() => startTransition(next))
    })
  }, [variant])

  return (
    <TransitionRouter leave={onLeave} enter={onEnter} auto>
      <div
        ref={transitionRef}
        className={cn(
          "fixed inset-0",
          Z_INDEX_CLASSNAMES.pageTransition,
          "w-full h-full overflow-hidden",
          variant === "fade"
            ? "bg-zinc-50 opacity-0 translate-y-full"
            : "bg-zinc-950 opacity-0 translate-y-full will-change-transform",
        )} />
      {children}
    </TransitionRouter>
  )
}
