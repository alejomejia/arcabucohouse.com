"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { type RefObject, useMemo, useRef } from "react";

import type { SpotlightContextValue } from "../spotlight-context";

/**
 * Optional configuration for spotlight scroll animation. All fields have defaults.
 *
 * @property pinHeightMultiplier - Pin length in viewport heights (default: 7)
 * @property scrub - ScrollTrigger scrub smoothness, 0 = instant (default: 1)
 * @property imageScrollEndProgress - Progress [0..1] at which image strip finishes moving (default: 0.5)
 * @property initialImagesYPercent - Starting translateY % for the image grid (default: 5)
 * @property maskRevealStart - Progress at which mask size starts growing (default: 0.25)
 * @property maskRevealEnd - Progress at which mask is fully revealed (default: 0.75)
 * @property maskSizeMaxPercent - Mask size at full reveal, in % (default: 800)
 * @property maskImageScaleStart - Banner scale when mask is hidden (default: 1.5)
 * @property maskImageScaleEnd - Banner scale when mask is fully revealed (default: 1)
 * @property wordRevealStart - Progress at which mask headline words start revealing (default: 0.75)
 * @property wordRevealEnd - Progress at which all words are visible (default: 0.95)
 */
export type UseSpotlightOptions = {
  pinHeightMultiplier?: number;
  scrub?: number;
  imageScrollEndProgress?: number;
  initialImagesYPercent?: number;
  maskRevealStart?: number;
  maskRevealEnd?: number;
  maskSizeMaxPercent?: number;
  maskImageScaleStart?: number;
  maskImageScaleEnd?: number;
  wordRevealStart?: number;
  wordRevealEnd?: number;
};

const DEFAULT_OPTIONS: Required<UseSpotlightOptions> = {
  pinHeightMultiplier: 7,
  scrub: 1,
  imageScrollEndProgress: 0.5,
  initialImagesYPercent: 5,
  maskRevealStart: 0.25,
  maskRevealEnd: 0.75,
  maskSizeMaxPercent: 600,
  maskImageScaleStart: 1.5,
  maskImageScaleEnd: 1,
  wordRevealStart: 0.75,
  wordRevealEnd: 0.95,
};

type UseSpotlightReturn = {
  contextValue: SpotlightContextValue;
  sectionRef: RefObject<HTMLElement | null>;
};

/**
 * Ref and context setup for the Spotlight section, plus GSAP scroll-driven animations.
 *
 * Manages: pin for N viewport heights, image grid y-scroll, mask size + banner scale,
 * mask headline word reveal. Use only in Spotlight.Root.
 *
 * @param options - Optional animation config (progress thresholds, durations, scales)
 * @returns Refs and context value for the spotlight compound tree
 *
 * @example
 * ```tsx
 * const { contextValue, sectionRef } = useSpotlight({
 *   pinHeightMultiplier: 5,
 *   wordRevealEnd: 0.9,
 * });
 * ```
 */
export function useSpotlight(options?: UseSpotlightOptions): UseSpotlightReturn {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const maskContainerRef = useRef<HTMLDivElement>(null);
  const maskImageRef = useRef<HTMLDivElement>(null);
  const maskHeaderRef = useRef<HTMLHeadingElement>(null);

  const contextValue = useMemo<SpotlightContextValue>(() => ({
    sectionRef,
    imagesRef,
    maskContainerRef,
    maskImageRef,
    maskHeaderRef,
  }), []);

  const opts = { ...DEFAULT_OPTIONS, ...options };

  useGSAP(
    () => {
      const section = sectionRef.current;
      const spotlightImages = imagesRef.current;
      const maskContainer = maskContainerRef.current;
      const maskImage = maskImageRef.current;
      const maskHeader = maskHeaderRef.current;

      if (!spotlightImages || !section) return;

      const viewportHeight = window.innerHeight;
      const spotlightContainerHeight = spotlightImages.offsetHeight;
      const initialOffset = spotlightContainerHeight * 0.05;
      
      // Total scroll distance so the strip can move from start to “fully scrolled” within the pin
      const totalMovement =
        spotlightContainerHeight + initialOffset + viewportHeight;

      let headerSplit: SplitText | null = null;

      if (maskHeader) {
        headerSplit = SplitText.create(maskHeader, {
          type: "words",
          wordsClass: "spotlight-word",
        });
        gsap.set(headerSplit.words, { opacity: 0 });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${viewportHeight * opts.pinHeightMultiplier}px`,
        pin: true,
        pinSpacing: true,
        scrub: opts.scrub,
        onUpdate: (self) => {
          const progress = self.progress;

          // Image strip: move from initial Y to end over the first N% of scroll progress
          if (progress <= opts.imageScrollEndProgress) {
            const segmentProgress =
              progress / opts.imageScrollEndProgress;
            const startY = opts.initialImagesYPercent;
            const endY =
              -(totalMovement / spotlightContainerHeight) * 100;
            const currentY = startY + (endY - startY) * segmentProgress;
            gsap.set(spotlightImages, { y: `${currentY}%` });
          }

          // Mask: grow from 0% to max size and scale banner from start to end scale
          if (maskContainer && maskImage) {
            const maskSegmentLength =
              opts.maskRevealEnd - opts.maskRevealStart;
            if (
              progress >= opts.maskRevealStart &&
              progress <= opts.maskRevealEnd
            ) {
              const maskProgress =
                (progress - opts.maskRevealStart) / maskSegmentLength;
              const maskSize = `${maskProgress * opts.maskSizeMaxPercent}%`;
              const imageScale =
                opts.maskImageScaleStart +
                (opts.maskImageScaleEnd - opts.maskImageScaleStart) *
                  maskProgress;

              maskContainer.style.setProperty(
                "-webkit-mask-size",
                maskSize
              );
              maskContainer.style.setProperty("mask-size", maskSize);
              gsap.set(maskImage, { scale: imageScale });
            } else if (progress < opts.maskRevealStart) {
              maskContainer.style.setProperty("-webkit-mask-size", "0%");
              maskContainer.style.setProperty("mask-size", "0%");
              gsap.set(maskImage, { scale: opts.maskImageScaleStart });
            } else if (progress > opts.maskRevealEnd) {
              maskContainer.style.setProperty(
                "-webkit-mask-size",
                `${opts.maskSizeMaxPercent}%`
              );
              maskContainer.style.setProperty(
                "mask-size",
                `${opts.maskSizeMaxPercent}%`
              );
              gsap.set(maskImage, { scale: opts.maskImageScaleEnd });
            }
          }

          // Mask headline: reveal words one by one between wordRevealStart and wordRevealEnd
          if (headerSplit?.words?.length) {
            const wordSegmentLength =
              opts.wordRevealEnd - opts.wordRevealStart;
            if (
              progress >= opts.wordRevealStart &&
              progress <= opts.wordRevealEnd
            ) {
              const textProgress =
                (progress - opts.wordRevealStart) / wordSegmentLength;
              const totalWords = headerSplit.words.length;

              headerSplit.words.forEach((word, index) => {
                const wordRevealProgress = index / totalWords;
                gsap.set(word, {
                  opacity: textProgress >= wordRevealProgress ? 1 : 0,
                });
              });
            } else if (progress < opts.wordRevealStart) {
              gsap.set(headerSplit.words, { opacity: 0 });
            } else if (progress > opts.wordRevealEnd) {
              gsap.set(headerSplit.words, { opacity: 1 });
            }
          }
        },
      });
    },
    { scope: sectionRef }
  );

  return { contextValue, sectionRef };
}
