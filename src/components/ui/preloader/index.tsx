"use client"

import { useRef } from "react"

import { SplitText } from "@/components/effects/split-text"
import { Z_INDEX_CLASSNAMES } from "@/lib/styles/const"
import { cn } from "@/lib/utils/helpers"

import { Logo } from "../logo"
import { usePreloader } from "./hooks/use-preloader"
import { usePreloaderTimeline } from "./hooks/use-preloader-timeline"

/**
 * Full-screen preloader with animated progress counter and clip-path reveal.
 *
 * Integrates with `PreloaderContext` — when the animation completes, it
 * calls `markReady()` to signal that page preloader animations can start.
 * The GSAP timeline itself lives in {@link usePreloaderTimeline}.
 *
 * @example
 * ```tsx
 * // Internal — consumers use PreloaderGate / usePreloader / usePreloaderGSAP.
 * ```
 */
export function Preloader() {
  const { markReady } = usePreloader()

  const containerRef = useRef<HTMLDivElement>(null)
  const progressContainerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef({ value: 0 })

  const handleDescriptionReady = usePreloaderTimeline({
    containerRef,
    progressContainerRef,
    progressRef,
    counterRef,
    onComplete: markReady,
  })

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0",
        Z_INDEX_CLASSNAMES.preloader,
        "bg-zinc-100 text-zinc-700",
      )}
    >
      <div className="px-4 md:px-6 py-4">
        <div className="max-w-60 mb-4">
          <Logo className="w-full" />
        </div>
        <SplitText type="lines" onReady={handleDescriptionReady}>
          <p className="text-base font-medium text-zinc-500 max-w-54">
            Artisan-made interiors from the heart of Latin America
          </p>
        </SplitText>
      </div>
      <div
        ref={progressContainerRef}
        className={cn(
          "fixed left-4 md:left-6 bottom-4 z-20",
          "origin-bottom-left scale-25 will-change-transform",
        )}
      >
        <span
          ref={progressRef}
          className="text-[clamp(2.5rem,25vw,25rem)] leading-none font-medium"
          aria-hidden="true"
        >
          0
        </span>
      </div>
    </div>
  )
}
