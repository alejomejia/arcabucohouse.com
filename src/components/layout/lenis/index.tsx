"use client";

import type { LenisOptions } from "lenis";
import type { LenisRef, LenisProps as ReactLenisProps } from "lenis/react";
import { ReactLenis } from "lenis/react";
import { ReactNode, useRef } from "react";
import { useTempus } from "tempus/react";

import { LenisScrollTriggerSync } from "./scroll-trigger";

/**
 * Props for the Lenis smooth scroll component.
 *
 * @property root - Whether this is the root scroll container. When true, enables ScrollTrigger sync
 * @property options - Optional Lenis configuration. Merged with defaults: `lerp: 0.125`, `autoRaf: false`, `anchors: true`
 * @property children - Child components to render within the Lenis scroll context
 */
interface LenisProps extends Omit<ReactLenisProps, "ref"> {
  root: boolean;
  options?: LenisOptions;
  children: ReactNode;
}

/**
 * Smooth scroll wrapper using Lenis with GSAP ScrollTrigger integration.
 *
 * Client Component - provides smooth scrolling via Lenis and syncs with GSAP ScrollTrigger
 * when used as root scroll container. Uses Tempus for requestAnimationFrame instead of
 * Lenis's built-in RAF to ensure consistent frame timing across the application.
 *
 * **Important Configuration Notes:**
 * - Do NOT import `lenis/dist/lenis.css` - this can cause scrollbar issues
 * - Do NOT use `autoToggle` option - it can cause document overflow and disappearing
 * scrollbars, making the entire website jump when Lenis starts/stops
 *
 * When `root` is true, automatically includes LenisScrollTriggerSync to keep GSAP
 * ScrollTrigger animations in sync with Lenis scroll position.
 *
 * @param root - Whether this is the root scroll container. When true, enables ScrollTrigger sync
 * @param options - Lenis configuration options. Defaults: `lerp: 0.125`, `autoRaf: false`, `anchors: true`
 * @param children - Child components to render within the Lenis scroll context
 *
 * @example
 * ```tsx
 * // Root layout - main scroll container
 * <Lenis root={true}>
 *   <App />
 * </Lenis>
 *
 * // Nested scroll container
 * <Lenis root={false} options={{ lerp: 0.1 }}>
 *   <ScrollableContent />
 * </Lenis>
 * ```
 */
export function Lenis({
  root,
  options,
  children
}: LenisProps) {
  const lenisRef = useRef<LenisRef>(null);

  useTempus((time: number) => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.raf(time);
    }
  });

  return (
    <ReactLenis
      ref={lenisRef}
      root={root}
      options={{
        ...options,
        lerp: options?.lerp ?? 0.125,
        autoRaf: false,
        anchors: true,
      }}
    >
      {root && <LenisScrollTriggerSync />}
      {children}
    </ReactLenis>
  );
}
