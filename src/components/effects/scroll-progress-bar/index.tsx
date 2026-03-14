"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { type HTMLAttributes, useRef } from "react";

import { usePreloaderGSAP } from "@/components/ui/preloader/hooks/use-preloader-gsap";
import { cn } from "@/lib/utils/helpers";
import { useNavigation } from "@/lib/utils/store";

const CLIP_PATH = {
  initial: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
  show: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  hideToRight: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
  setBeforeIn: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
  showFromLeft: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
} as const;

const ANIMATION_CONFIG = {
  duration: 1,
  ease: "power3.inOut",
} as const;

/**
 * Displays a progress bar that scales from 0 to 1
 * based on the user's scroll position through the entire document.
 *
 * @example
 * ```tsx
 * <ScrollProgressBar />
 * ```
 */
export function ScrollProgressBar(props: HTMLAttributes<HTMLDivElement>) {
  const { navState, isNavOpen } = useNavigation();
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const prevNavStateRef = useRef<typeof navState | null>(null);

  // Mount animation - waits for preloader, runs only once
  usePreloaderGSAP(
    () => {
      if (!containerRef.current) return;

      return gsap.to(containerRef.current, {
        clipPath: CLIP_PATH.show,
        ...ANIMATION_CONFIG,
      });
    },
    { scope: containerRef }
  );

  // Scroll progress bar animation (not tied to preloader - always active)
  useGSAP(
    () => {
      if (!containerRef.current || !progressBarRef.current) return;

      // Refresh to recalculate scroll height for the new page
      ScrollTrigger.refresh();

      const setScaleX = gsap.quickSetter(progressBarRef.current, "scaleX");

      const scrollTrigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        scrub: true,
        onUpdate: (self) => {
          setScaleX(self.progress);
        },
      });

      return () => scrollTrigger.kill();
    },
    { scope: containerRef, dependencies: [pathname] }
  );

  // Show/hide depending on navigation state - skips first render
  useGSAP(
    () => {
      if (!containerRef.current || !progressBarRef.current) return;

      // Skip animation on initial mount
      if (prevNavStateRef.current === null) {
        prevNavStateRef.current = navState;
        return;
      }

      const prevIsNavOpen =
        prevNavStateRef.current === "open" ||
        prevNavStateRef.current === "opening";

      // Only animate if the open/closed state has actually changed
      if (prevIsNavOpen === isNavOpen) return;

      // Set clip path before animation when closing nav
      if (prevIsNavOpen) {
        gsap.set(containerRef.current, {
          clipPath: CLIP_PATH.setBeforeIn,
        });
      }

      prevNavStateRef.current = navState;

      gsap.to(containerRef.current, {
        clipPath: isNavOpen ? CLIP_PATH.hideToRight : CLIP_PATH.showFromLeft,
        duration: isNavOpen ? 0.25 : 0.75,
        delay: isNavOpen ? 0 : 0.75,
        ease: "smoothSnap",
      });
    },
    { scope: containerRef, dependencies: [navState] }
  );

  return (
    <div
      ref={containerRef}
      style={{ clipPath: CLIP_PATH.initial }}
      {...props}
    >
      <div className="relative w-full h-px bg-neutral-800">
        <div
          ref={progressBarRef}
          className={cn(
            "absolute top-0 left-0",
            "w-full h-px",
            "bg-neutral-100 z-10",
            "scale-x-0 origin-left"
          )}
        />
      </div>
    </div>
  );
}