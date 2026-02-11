"use client"

/**
 * GSAP Runtime
 *
 * Syncs GSAP's ticker with Tempus for consistent frame timing.
 * ScrollTrigger sync is handled automatically by `<Lenis root />`.
 *
 * Plugin registration, defaults, and custom easing curves live in
 * `./register.ts` and are evaluated once (HMR-safe).
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { GSAPRuntime } from '@/components/effects/gsap'
 *
 * <body>
 *   <GSAPRuntime />
 *   {children}
 * </body>
 * ```
 */

import "@/components/effects/gsap/register"

import gsap from "gsap";
import { useTempus } from "tempus/react";

/**
 * Syncs GSAP ticker with Tempus frame loop.
 * Add to your root layout to enable GSAP animations.
 */
export function GSAPRuntime() {
  useTempus((time) => {
    gsap.updateRoot(time / 1000);
  });

  return null;
}

