import { useEffect, useLayoutEffect, useRef } from "react";
import { usePreloader } from "./use-preloader";

/**
 * Convenience hook that runs a callback when preloader animations can start.
 * Handles cleanup automatically to prevent animations running after unmount.
 *
 * @param callback - Function to run when ready (receives isReady boolean)
 * @param deps - Additional dependencies to watch
 *
 * @example
 * ```tsx
 * function HeroTitle() {
 *   const ref = useRef<HTMLHeadingElement>(null);
 *
 *   useOnPreloaderReady(() => {
 *     gsap.from(ref.current, { y: 100, opacity: 0, duration: 1.2 });
 *   });
 *
 *   return <h1 ref={ref}>Welcome</h1>;
 * }
 * ```
 */
export function useOnPreloaderReady(
  callback: () => void | (() => void),
  deps: React.DependencyList = []
): void {
  const { waitForReady } = usePreloader();
  const callbackRef = useRef(callback);

  // Keep callback ref fresh
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    let cancelled = false;
    let cleanup: void | (() => void);

    waitForReady().then(() => {
      if (cancelled) return;
      cleanup = callbackRef.current();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [waitForReady, ...deps]);
}