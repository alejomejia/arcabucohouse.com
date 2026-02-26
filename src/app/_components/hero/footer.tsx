"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTransitionState } from "next-transition-router";
import { useRef, useState } from "react";

import { type SplitTextRef, SplitText } from "@/components/effects/split-text";
import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Container } from "@/components/ui/container";
import { usePreloader } from "@/components/ui/preloader/hooks/use-preloader";
import type { Menu } from '@/lib/integrations/shopify/types';
import { cn } from "@/lib/utils/helpers";

const ANIMATION_CONFIG = {
  duration: 1,
  ease: "gentleSlow",
  stagger: 0.075,
  delay: 0.25, // Small delay relative to header animation
} as const;

type HeroFooterProps = {
  categories: Menu[]
}

export function HeroFooter({ categories }: HeroFooterProps) {
  const { isReady: isTransitionReady } = useTransitionState()

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitTextRef>(null)

  const { isReady: preloaderReady } = usePreloader()
  const [splitReady, setSplitReady] = useState(false)

  // Animate when both preloader and split are ready
  useGSAP(
    () => {
      if (!preloaderReady || !splitReady || !isTransitionReady) return
      if (!textRef.current || !containerRef.current) return

      const elements = textRef.current.getElements()
      if (elements.length === 0) return

      gsap.set(containerRef.current, { opacity: 1 })
      gsap.fromTo(
        elements,
        { yPercent: 100 },
        { yPercent: 0, ...ANIMATION_CONFIG }
      )
    },
    {
      scope: containerRef,
      dependencies: [preloaderReady, splitReady, isTransitionReady]
    }
  )

  return (
    <Container className="w-full pb-8 md:py-8 font-medium">
      <div ref={containerRef} className="opacity-0">
        <SplitText
          ref={textRef}
          type="words"
          onReady={() => setSplitReady(true)}
        >
          <ul className={cn(
            "flex flex-col gap-4 md:gap-2 justify-center items-center",
            "md:flex-row md:gap-4",
            "uppercase font-serif font-semibold text-primary-base"
          )}>
            {categories.map(({ title, path }, index) => (
              <li key={title} className="flex flex-col md:flex-row items-center gap-2 leading-none">
                <UnderlineLink href={path} className="tracking-wider">
                  {title}
                </UnderlineLink>
                {index < categories.length - 1 && (
                  <span className="text-neutral-400 leading-none hidden md:inline-block">—</span>
                )}
              </li>
            ))}
          </ul>
        </SplitText>
      </div>
    </Container>
  )
}