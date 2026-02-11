"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useRef, useState } from "react";

import { SplitText, type SplitTextRef } from "@/components/effects/split-text";
import { Container } from "@/components/ui/container";
import { usePreloader } from "@/components/ui/preloader/hooks/use-preloader";

const ANIMATION_CONFIG = {
  duration: 1,
  ease: "gentleSlow",
  stagger: 0.25,
} as const;

export function HeroHeader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<SplitTextRef>(null)
  const descriptionRef = useRef<SplitTextRef>(null)
  const hasPlayedRef = useRef(false)

  const { isReady: preloaderReady } = usePreloader()
  const [splitsReady, setSplitsReady] = useState(0)

  const handleSplitReady = useCallback(() => {
    setSplitsReady(prev => prev + 1)
  }, [])

  // Animate when preloader is done and both splits are ready
  useGSAP(
    () => {
      if (hasPlayedRef.current) return
      if (!preloaderReady || splitsReady < 2) return
      if (!titleRef.current || !descriptionRef.current || !containerRef.current) return

      const title = titleRef.current.getElements()
      const description = descriptionRef.current.getElements()

      if (title.length === 0 || description.length === 0) return

      hasPlayedRef.current = true

      gsap.set(containerRef.current, { opacity: 1 })

      const elements = [...title, ...description]

      gsap.fromTo(
        elements,
        { yPercent: 100 },
        { yPercent: 0, ...ANIMATION_CONFIG }
      )
    },
    {
      scope: containerRef,
      dependencies: [preloaderReady, splitsReady]
    }
  )

  return (
    <Container className="w-full pt-6">
      <div
        ref={containerRef}
        className="text-center flex flex-col justify-center items-center gap-1 opacity-0"
      >
        <h1 className="mb-4">
          <SplitText ref={titleRef} type="lines" onReady={handleSplitReady}>
            <span className="block font-serif text-3xl lg:text-4xl text-primary-base italic text-pretty leading-none">
              Curated South American Artistry
            </span>
            <span className="text-4xl lg:text-5xl leading-none tracking-wider uppercase text-secondary-300">
              for modern interiors
            </span>
          </SplitText>
        </h1>
        <SplitText ref={descriptionRef} type="lines" onReady={handleSplitReady}>
          <p className="max-w-96 font-serif font-medium text-xl text-primary-base leading-tight">
            Design objects born in Latin America, curated for modern living
          </p>
        </SplitText>
      </div>
    </Container>
  )
}
