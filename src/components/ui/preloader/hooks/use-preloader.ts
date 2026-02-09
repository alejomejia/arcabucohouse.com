import { useContext } from "react";

import { PreloaderContext, PreloaderContextValue } from "./preloader-context";

/**
 * Access preloader animation coordination from any component.
 *
 * @throws Error if used outside PreloaderProvider
 *
 * @example
 * ```tsx
 * function AnimatedSection() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { waitForReady } = usePreloader();
 *
 *   useGSAP(() => {
 *     let cancelled = false;
 *
 *     waitForReady().then(() => {
 *       if (cancelled) return;
 *       gsap.from(ref.current, { y: 50, opacity: 0, duration: 1 });
 *     });
 *
 *     return () => { cancelled = true; };
 *   }, { scope: ref });
 *
 *   return <div ref={ref}>Animated content</div>;
 * }
 * ```
 */
export function usePreloader(): PreloaderContextValue {
  const context = useContext(PreloaderContext);

  if (!context) {
    throw new Error(
      "usePreloader must be used within an PreloaderProvider"
    );
  }

  return context;
}