"use client";

import { useGSAP, type ContextSafeFunc } from "@gsap/react";
import { useRef, type DependencyList, type RefObject } from "react";

import { usePreloader } from "./use-preloader";

export interface UsePreloaderGSAPOptions<T extends Element> {
  /**
   * Scope element for GSAP context. Animations will be scoped to this element.
   * Pass the same ref you use for your container element.
   */
  scope?: RefObject<T | null>;

  /**
   * Additional dependencies that should trigger re-running the animation.
   * The preloader ready state is automatically included.
   */
  dependencies?: DependencyList;
}

export interface UsePreloaderGSAPResult {
  /**
   * GSAP context-safe function. Use this to create animations that will
   * be properly cleaned up when the component unmounts.
   */
  contextSafe: ContextSafeFunc;

  /**
   * Whether preloader animations are ready to run.
   * True when preloader is done or was skipped.
   */
  isReady: boolean;
}

/**
 * GSAP integration hook for preloader animations.
 *
 * Creates animations that:
 * - Wait for preloader to complete (or start immediately if skipped)
 * - Are properly scoped and cleaned up
 * - Only run once (React Strict Mode safe)
 *
 * @param callback - GSAP animation callback. Only runs when preloader is ready.
 * Return a GSAP timeline for proper cleanup.
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function HeroSection() {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   const titleRef = useRef<HTMLHeadingElement>(null);
 *   const subtitleRef = useRef<HTMLParagraphElement>(null);
 *
 *   usePreloaderGSAP(
 *     () => {
 *       // This only runs when preloader is done or skipped
 *       const tl = gsap.timeline();
 *
 *       tl.from(titleRef.current, {
 *         y: 100,
 *         opacity: 0,
 *         duration: 1,
 *         ease: "power3.out",
 *       });
 *
 *       tl.from(
 *         subtitleRef.current,
 *         {
 *           y: 50,
 *           opacity: 0,
 *           duration: 0.8,
 *           ease: "power3.out",
 *         },
 *         "-=0.5"
 *       );
 *
 *       return tl; // Return timeline for cleanup
 *     },
 *     { scope: containerRef }
 *   );
 *
 *   return (
 *     <div ref={containerRef}>
 *       <h1 ref={titleRef}>Welcome</h1>
 *       <p ref={subtitleRef}>Subtitle text</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePreloaderGSAP<T extends Element = Element>(
  callback: (context: { contextSafe: ContextSafeFunc }) => gsap.core.Timeline | gsap.core.Tween | void,
  options: UsePreloaderGSAPOptions<T> = {}
): UsePreloaderGSAPResult {
  const { scope, dependencies = [] } = options;
  const { isReady } = usePreloader();

  const animationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);

  const { contextSafe } = useGSAP(
    (context) => {
      // Don't run until ready
      if (!isReady) return;

      // Run the animation callback
      const result = callback({ contextSafe: context.contextSafe });

      // Store animation for cleanup
      if (result) {
        animationRef.current = result;
      }

      // Cleanup function
      return () => {
        animationRef.current?.kill();
        animationRef.current = null;
      };
    },
    {
      scope: scope ?? undefined,
      dependencies: [isReady, ...dependencies],
    }
  );

  return { contextSafe, isReady };
}

