"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type HTMLAttributes, useRef } from "react";

import { orchestraNavigation } from "@/lib/orchestra";
import { cn } from "@/lib/utils/helpers";
import { useNavigation } from "@/lib/utils/store";

// Starts by the center of the container to animate to the sides
const CLIP_PATH_INITIAL = "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)";
const CLIP_PATH_INITIAL_SHOW = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

// Hides to the right, show from the left
const CLIP_PATH_HIDE_TO_RIGHT = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)";
const CLIP_PATH_SET_BEFORE_IN = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
const CLIP_PATH_SHOW_FROM_LEFT = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

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
  const { navState, isNavOpen } = useNavigation()

  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const prevNavStateRef = useRef<typeof navState | null>(null);

  // Mount animation - runs only once on mount
  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      clipPath: CLIP_PATH_INITIAL_SHOW,
      ...orchestraNavigation.progressBar,
    })
  }, { scope: containerRef })

  // Scroll progress bar animation
  useGSAP(() => {
    if (!containerRef.current || !progressBarRef.current) return;

    // Create ScrollTrigger that tracks the entire document scroll
    // Using document.documentElement (html) to track full page scroll
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      scrub: true,
      onUpdate: (self) => {
        // Use the ScrollTrigger's calculated progress (0 to 1)
        gsap.set(progressBarRef.current, {
          scaleX: self.progress,
        });
      },
      invalidateOnRefresh: true,
    });

  }, { scope: containerRef });

  // Show / hide depending on navigation state - skips first render
  useGSAP(() => {
    if (!containerRef.current || !progressBarRef.current) return;

    // Skip animation on initial mount (when prevNavStateRef is null)
    if (prevNavStateRef.current === null) {
      prevNavStateRef.current = navState;
      return;
    }

    const prevIsNavOpen =
      prevNavStateRef.current === 'open' ||
      prevNavStateRef.current === 'opening'

    // Only animate if the open/closed state has actually changed
    if (prevIsNavOpen === isNavOpen) return;

    // Set the clip path to the left before the animation starts
    // This makes the animation appears from the left only when nav is opened
    if (prevIsNavOpen) {
      gsap.set(containerRef.current, {
        clipPath: CLIP_PATH_SET_BEFORE_IN,
      })
    }

    prevNavStateRef.current = navState;

    gsap.to(containerRef.current, {
      clipPath: isNavOpen ? CLIP_PATH_HIDE_TO_RIGHT : CLIP_PATH_SHOW_FROM_LEFT,
      duration: isNavOpen ? 0.25 : 0.75,
      delay: isNavOpen ? 0 : 0.75,
      ease: "smoothSnap",
    })

  }, { scope: containerRef, dependencies: [navState] })

  return (
    <div ref={containerRef} style={{ clipPath: CLIP_PATH_INITIAL }} {...props}>
      <div className='relative w-full h-px bg-neutral-800'>
        <div
          ref={progressBarRef}
          className={cn(
            'absolute top-0 left-0',
            'w-full h-px bg-neutral-100 z-10',
            'scale-x-0 origin-left'
          )}
        />
      </div>
    </div>
  );
}