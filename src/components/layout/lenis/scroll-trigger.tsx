import { ScrollTrigger as GSAPScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Syncs GSAP ScrollTrigger with Lenis scroll position.
 * Must be rendered inside ReactLenis context.
 */
export function LenisScrollTriggerSync() {
  const pathname = usePathname();
  const lenis = useLenis(() => GSAPScrollTrigger.update());

  useEffect(() => {
    GSAPScrollTrigger.update();
  }, []);

  useEffect(() => {
    if (lenis) {
      GSAPScrollTrigger.refresh()
    }
  }, [lenis, pathname]);

  return null;
}
