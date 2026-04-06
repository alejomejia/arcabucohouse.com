"use client";

import gsap from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useCallback, useRef } from "react";

import { SplitText } from "@/components/effects/split-text";
import { cn } from "@/lib/utils/helpers";

import { Z_INDEX_CLASSNAMES } from "@/lib/styles/const";
import { Logo } from "../logo";
import { usePreloader } from "./hooks/use-preloader";

const CLIP_PATH = {
  initial: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  final: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
} as const;

const TIMING = {
  descriptionDuration: 1.5,
  descriptionStagger: 0.5,
  counterDuration: 3,
  scaleDuration: 2.5,
  digitSlideDelay: 1,
  digitSlideDuration: 0.75,
  digitSlideStagger: 0.1,
  revealDuration: 1,
} as const;

/**
 * Full-screen preloader with animated progress counter and clip-path reveal.
 *
 * Integrates with PreloaderContext - when the animation completes, it
 * calls markReady() to signal that page preloader animations can start.
 *
 * The preloader runs a GSAP timeline:
 * 1. Counter 0→100 with scale-up
 * 2. Digit slide-out animation
 * 3. Clip-path collapse reveal
 *
 * @example
 * ```tsx
 * // Used internally by PreloaderGate
 * // Consumer components use usePreloader() or useOnPreloaderReady()
 * ```
 */
export function Preloader() {
  const { markReady } = usePreloader();

  const containerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ value: 0 });

  // Create the full preloader timeline when the description split is ready.
  // Animations are tracked by SplitText's context for automatic cleanup.
  const handleDescriptionReady = useCallback((lines: HTMLElement[]) => {
    const container = containerRef.current;
    const progressContainer = progressContainerRef.current;
    const progressEl = progressRef.current;

    if (!container || !progressContainer || !progressEl) return;

    const counter = counterRef.current;

    // Main timeline - signals ready when complete
    const tl = gsap.timeline({
      onComplete: markReady,
    });

    // Set initial state
    tl.set(container, { clipPath: CLIP_PATH.initial });

    tl.fromTo(
      lines,
      { yPercent: 100 },
      {
        yPercent: 0,
        ease: "gentleSlow",
        stagger: TIMING.descriptionStagger,
        duration: TIMING.descriptionDuration
      },
      0
    );

    // Counter animation (0 → 100)
    tl.to(
      counter,
      {
        value: 100,
        duration: TIMING.counterDuration,
        ease: "power3.out",
        onUpdate: () => {
          progressEl.textContent = Math.floor(counter.value).toString();
        },
        onComplete: () => {
          // Split text and animate digits out
          const split = new GSAPSplitText(progressEl, {
            type: "chars",
            charsClass: "digit",
            mask: "chars",
          });

          gsap.to(split.chars, {
            x: "-100%",
            duration: TIMING.digitSlideDuration,
            ease: "power3.out",
            stagger: TIMING.digitSlideStagger,
            delay: TIMING.digitSlideDelay,
          });
        },
      },
      0.5
    );

    // Scale up the progress container in parallel
    tl.to(
      progressContainer,
      {
        scale: 1,
        duration: TIMING.scaleDuration,
        ease: "power3.out",
      },
      0.5
    );

    // Final reveal - clip-path collapse
    tl.to(container, {
      clipPath: CLIP_PATH.final,
      duration: TIMING.revealDuration,
      ease: "power3.inOut",
    }, "counterComplete+=1.5");
  }, [markReady]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0",
        Z_INDEX_CLASSNAMES.preloader,
        "bg-zinc-100 text-zinc-700"
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
          "origin-bottom-left scale-25 will-change-transform"
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
  );
}
