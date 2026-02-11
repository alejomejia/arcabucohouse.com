"use client"

import gsap from "gsap";
import { useCallback, useRef } from "react";

import { SplitText } from "@/components/effects/split-text";
import { cn } from "@/lib/utils/helpers";

const ANIMATION_CONFIG = {
  ease: "gentleSlow",
  duration: 2,
  stagger: 0.25
} as const

export function Heading() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Create scroll-triggered animation when split is ready
  const handleReady = useCallback((elements: HTMLElement[]) => {
    if (elements.length === 0 || !containerRef.current) return

    const [first, last] = [elements.at(0), elements.at(-1)]
    const middle = elements.slice(1, -1)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
      }
    })

    gsap.set(elements, { yPercent: 110 })

    tl.to(
      [first, last],
      {
        yPercent: 0,
        ...ANIMATION_CONFIG
      }
    )

    tl.to(
      middle,
      {
        yPercent: 0,
        delay: 0.25,
        ...ANIMATION_CONFIG,
      },
      0 // animate together with the first and last elements
    )
  }, [])

  return (
    <div ref={containerRef} className="col-span-full">
      <SplitText type="words" onReady={handleReady}>
        <h2 className={cn(
          "flex items-center justify-evenly mb-6 children:inline-block",
          "font-serif uppercase text-primary-base text-[5vw] tracking-wider"
        )}>
          <span className="flex-1 mt-6 px-6 col-span-12 leading-none italic">Design</span>
          <span className="flex-1 text-lg font-sans text-center text-secondary-300">High end craftsmanship</span>
          <span className="flex-1 mt-6 px-6 col-span-12 leading-none text-right italic">Services</span>
        </h2>
      </SplitText>
    </div>
  )
}
