import { isDev } from "@/lib/utils/config";
import gsap from "gsap";
import { ScrollTrigger as GSAPScrollTrigger } from "gsap/all";
import { useLenis } from "lenis/react";
import { useEffect } from "react";

// Register ScrollTrigger once
if (typeof window !== "undefined") {
  gsap.registerPlugin(GSAPScrollTrigger);

  GSAPScrollTrigger.defaults({
    markers: isDev,
  });
}

/**
 * Syncs GSAP ScrollTrigger with Lenis scroll position.
 * Must be rendered inside ReactLenis context.
 */
export function LenisScrollTriggerSync() {
  useEffect(() => {
    GSAPScrollTrigger.update();
  }, []);

  const handleUpdate = () => GSAPScrollTrigger.update();
  const handleRefresh = () => GSAPScrollTrigger.refresh();

  const lenis = useLenis(handleUpdate);

  useEffect(() => {
    if (lenis) {
      handleRefresh();
    }
  }, [lenis]);

  return null;
}
