import { ScrollTrigger as GSAPScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Syncs GSAP ScrollTrigger with Lenis scroll position.
 * Must be rendered inside ReactLenis context.
 *
 * Batches ScrollTrigger.refresh() calls via requestAnimationFrame to avoid
 * redundant layout recalculations when multiple triggers fire in the same frame.
 */
export function LenisScrollTriggerSync() {
  const pathname = usePathname();
  const refreshRafRef = useRef<number | null>(null);
  const lenis = useLenis(() => GSAPScrollTrigger.update());

  useEffect(() => {
    GSAPScrollTrigger.update();
  }, []);

  useEffect(() => {
    if (lenis) {
      // Batch the refresh to avoid multiple layout recalculations in one frame.
      // Multiple components may trigger refreshes on route change — this
      // coalesces them into a single refresh on the next animation frame.
      if (refreshRafRef.current) cancelAnimationFrame(refreshRafRef.current);
      refreshRafRef.current = requestAnimationFrame(() => {
        GSAPScrollTrigger.refresh();
        refreshRafRef.current = null;
      });
    }

    return () => {
      if (refreshRafRef.current) {
        cancelAnimationFrame(refreshRafRef.current);
        refreshRafRef.current = null;
      }
    };
  }, [lenis, pathname]);

  return null;
}
