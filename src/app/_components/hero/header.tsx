"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { SplitText, type SplitTextRef } from "@/components/effects/split-text";
import { Container } from "@/components/ui/container";
import { orchestraHomeHero } from "@/lib/orchestra";

export function HeroHeader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<SplitTextRef>(null)
  const descriptionRef = useRef<SplitTextRef>(null)

  useGSAP(() => {
    const createAnimation = () => {
      if (!titleRef.current || !descriptionRef.current || !containerRef.current) return

      const container = containerRef.current

      const title = titleRef.current.getElements()
      const description = descriptionRef.current.getElements()

      if (title.length === 0 || description.length === 0) return

      gsap.set(container, { opacity: 1 })

      const elements = [...title, ...description]

      gsap.fromTo(
        elements,
        { yPercent: 100 },
        {
          yPercent: 0,
          ...orchestraHomeHero.header,
        }
      )
    }

    // Wait for split to be ready
    const checkReady = () => {
      if (!titleRef.current?.isReady() || !descriptionRef.current?.isReady()) {
        setTimeout(checkReady, 50)
        return
      }

      createAnimation()
    }

    checkReady()
  }, { scope: containerRef })

  return (
    <Container className="w-full pt-10">
      <div ref={containerRef} className="flex justify-between gap-8 opacity-0">
        <h1 className="font-serif">
          <SplitText ref={titleRef} type="lines">
            <span className="block text-4xl text-primary-base italic">Curated South American Artistry</span>
            <span className="text-5xl tracking-wider uppercase text-secondary-300">
              for modern interiors
            </span>
          </SplitText>
        </h1>
        <SplitText ref={descriptionRef} type="lines">
          <p className="max-w-128 font-medium text-pretty text-secondary-600">Each piece emerges from the hands of skilled makers who understand their materials as living things. We work directly with Latin American artisans and companies, honoring generations of technique while pushing towards something new.</p>
        </SplitText>
      </div>
    </Container>
  )
}
