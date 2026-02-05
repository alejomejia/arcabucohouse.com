"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

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

  const { waitForReady } = usePreloader()

  useGSAP(
    () => {
      const runAnimation = async () => {
        if (hasPlayedRef.current) return
        if (!titleRef.current || !descriptionRef.current || !containerRef.current) return

        // Wait for preloader to complete (resolves immediately if skipped)
        await waitForReady()
        if (hasPlayedRef.current) return

        // Wait for both SplitText instances to be ready
        await Promise.all([
          titleRef.current.ready(),
          descriptionRef.current.ready(),
        ])

        if (hasPlayedRef.current) return

        const container = containerRef.current
        const title = titleRef.current.getElements()
        const description = descriptionRef.current.getElements()

        if (title.length === 0 || description.length === 0) return

        hasPlayedRef.current = true

        gsap.set(container, { opacity: 1 })

        const elements = [...title, ...description]

        gsap.fromTo(
          elements,
          { yPercent: 100 },
          { yPercent: 0, ...ANIMATION_CONFIG }
        )
      }

      runAnimation()
    },
    { scope: containerRef }
  )

  return (
    <Container className="w-full pt-10">
      <div
        ref={containerRef}
        className="text-center flex flex-col justify-center items-center gap-1 opacity-0"
      >
        <h1 className="font-serif">
          <SplitText ref={titleRef} type="lines">
            <span className="block text-3xl lg:text-4xl text-primary-base italic text-pretty leading-none mb-1">
              Curated South American Artistry
            </span>
            <span className="text-4xl lg:text-5xl tracking-wider uppercase text-secondary-300">
              for modern interiors
            </span>
          </SplitText>
        </h1>
        <SplitText ref={descriptionRef} type="lines">
          <p className="max-w-84 font-medium text-secondary-600">
            Design objects born in Latin America, curated for modern living
          </p>
        </SplitText>
      </div>
    </Container>
  )
}
