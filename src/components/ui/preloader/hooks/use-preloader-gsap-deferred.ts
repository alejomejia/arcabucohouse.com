import { usePreloader } from "./use-preloader";

/**
 * Hook that returns a function to create animations that wait for preloader ready.
 *
 * Useful when you need more control over when animations start, or when
 * animations need to be triggered by user interaction but should still
 * wait for preloader to be ready first.
 *
 * @example
 * ```tsx
 * function AnimatedButton() {
 *   const ref = useRef<HTMLButtonElement>(null);
 *   const { animateWhenReady } = usePreloaderGSAPDeferred();
 *
 *   useEffect(() => {
 *     // This animation waits for preloader ready, then plays
 *     animateWhenReady(() => {
 *       return gsap.from(ref.current, { scale: 0.9, opacity: 0 });
 *     });
 *   }, [animateWhenReady]);
 *
 *   return <button ref={ref}>Click me</button>;
 * }
 * ```
 */
export function usePreloaderGSAPDeferred(): {
  animateWhenReady: (
    callback: () => gsap.core.Timeline | gsap.core.Tween | void
  ) => Promise<void>;
  isReady: boolean;
} {
  const { isReady, waitForReady } = usePreloader();

  const animateWhenReady = async (
    callback: () => gsap.core.Timeline | gsap.core.Tween | void
  ): Promise<void> => {
    await waitForReady();
    callback();
  };

  return { animateWhenReady, isReady };
}
