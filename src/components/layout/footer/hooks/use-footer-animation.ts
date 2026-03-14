"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import type { RefObject } from "react";

const ANIMATION_CONFIG = {
  duration: 2,
  stagger: 0.25,
  ease: "gentleSlow",
} as const;

/** Delay between each column starting its animation */
const COLUMN_STAGGER = 0.25;

/** Orchestrates the scroll-driven reveal animation for footer columns, bottom bar, and logo. */
export function useFooterAnimation(
  footerRef: RefObject<HTMLDivElement | null>,
  logoRef: RefObject<HTMLDivElement | null>
) {
  useGSAP(() => {
    if (!footerRef.current || !logoRef.current) return;

    const columns = gsap.utils.toArray<HTMLElement>("[data-footer-col]");
    const bottomBar = footerRef.current.querySelector("[data-footer-bottom]");

    // Collect SplitText instances so they can be reverted on cleanup.
    // useGSAP reverts tweens/ScrollTriggers automatically but not SplitText DOM mutations.
    const splits: GSAPSplitText[] = [];

    // Master timeline with ScrollTrigger — column staggers are
    // positioned inside the timeline so scroll drives everything.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#main",
        start: () => `bottom-=${window.innerHeight / 2}px bottom`,
        end: () => `bottom-=${window.innerHeight / 2}px top`,
        invalidateOnRefresh: true,
      },
    });

    // Animate each column at a staggered position within the timeline
    columns.forEach((col, index) => {
      const split = GSAPSplitText.create(col.querySelectorAll("h4, p, a"), {
        type: "lines",
        mask: "lines",
      });
      splits.push(split);

      if (split.lines.length === 0) return;

      gsap.set(split.lines, { yPercent: 100 });

      tl.to(
        split.lines,
        { yPercent: 0, ...ANIMATION_CONFIG },
        index * COLUMN_STAGGER
      );
    });

    // Bottom bar enters after all columns
    if (bottomBar) {
      const split = GSAPSplitText.create(bottomBar.querySelectorAll("span"), {
        type: "lines",
        mask: "lines",
      });
      splits.push(split);

      if (split.lines.length > 0) {
        gsap.set(split.lines, { yPercent: 100 });

        tl.to(
          split.lines,
          { yPercent: 0, ...ANIMATION_CONFIG },
          columns.length * COLUMN_STAGGER
        );
      }
    }

    // Logo SVG path reveal — scrub-driven, independent from the column timeline
    if (logoRef.current) {
      const paths = logoRef.current.querySelectorAll("svg path");

      if (paths.length > 0) {
        gsap.fromTo(
          paths,
          { yPercent: 100 },
          {
            yPercent: 0,
            stagger: 0.05,
            ease: "gentleSlow",
            scrollTrigger: {
              trigger: "#main",
              start: () => `bottom-=${window.innerHeight}px bottom`,
              end: () => `bottom-=${window.innerHeight}px top`,
              scrub: true,
            },
          }
        );
      }
    }

    return () => {
      splits.forEach((split) => split.revert());
    };
  }, { scope: footerRef });
}
