"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTransitionState } from "next-transition-router";
import { useCallback, useRef, useState } from "react";

import { SplitText, type SplitTextRef } from "@/components/effects/split-text";
import { Container } from "@/components/ui/container";
import { usePreloader } from "@/components/ui/preloader/hooks/use-preloader";
import { Text } from "@/components/ui/text";

const ANIMATION_CONFIG = {
  duration: 1,
  ease: "gentleSlow",
  stagger: 0.25,
} as const;

export function HeroHeader() {
  const { isReady: isTransitionReady } = useTransitionState()

  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<SplitTextRef>(null)
  const descriptionRef = useRef<SplitTextRef>(null)

  const { isReady: preloaderReady } = usePreloader()
  const [splitsReady, setSplitsReady] = useState(0)

  const handleSplitReady = useCallback(() => {
    setSplitsReady(prev => prev + 1)
  }, [])

  // Animate when preloader is done, transition is done and both splits are ready
  useGSAP(
    () => {
      if (!preloaderReady || splitsReady < 2 || !isTransitionReady) return
      if (!titleRef.current || !descriptionRef.current || !containerRef.current) return

      const title = titleRef.current.getElements()
      const description = descriptionRef.current.getElements()

      if (title.length === 0 || description.length === 0) return

      gsap.set(containerRef.current, { opacity: 1 })

      const elements = [...title, ...description]

      gsap.fromTo(
        elements,
        { yPercent: 100 },
        {
          yPercent: 0,
          ...ANIMATION_CONFIG
        }
      )
    },
    {
      scope: containerRef,
      dependencies: [preloaderReady, splitsReady, isTransitionReady]
    }
  )

  return (
    <Container className="w-full pt-8 mb-16">
      <div
        ref={containerRef}
        className="text-center flex flex-col justify-center items-center gap-1 opacity-0"
      >
        <h1 className="mb-4">
          <SplitText ref={titleRef} type="lines" onReady={handleSplitReady}>
            <Text as="span" className="block text-3xl lg:text-4xl text-zinc-500 text-pretty">
              Curated Latin American Artistry
            </Text>
            <Text as="span" className="text-4xl lg:text-5xl leading-none tracking-wider uppercase text-zinc-700">
              for modern interiors
            </Text>
          </SplitText>
        </h1>
        <SplitText ref={descriptionRef} type="lines" onReady={handleSplitReady}>
          <Text preset="body" className="max-w-84">
            Design objects born in Latin America, curated for modern living
          </Text>
        </SplitText>
      </div>
    </Container>
  )
}
