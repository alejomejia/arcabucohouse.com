"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { type SplitTextRef, SplitText } from "@/components/effects/split-text";
import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Container } from "@/components/ui/container";
import { usePreloader } from "@/components/ui/preloader/hooks/use-preloader";
import { cn } from "@/lib/utils/helpers";

const ANIMATION_CONFIG = {
  duration: 1,
  ease: "gentleSlow",
  stagger: 0.075,
  delay: 0.25, // Small delay relative to header animation
} as const;

const COLLECTIONS = [
  {
    id: "rugs",
    name: "Rugs",
    href: "/collections/rugs",
  },
  {
    id: "lights",
    name: "Lights",
    href: "/collections/lights",
  },
  {
    id: "ceramics",
    name: "Ceramics",
    href: "/collections/ceramics",
  },
  {
    id: "accessories",
    name: "Accessories",
    href: "/collections/accessories",
  },
]

export function HeroFooter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitTextRef>(null)
  const hasPlayedRef = useRef(false)

  const { waitForReady } = usePreloader()

  useGSAP(
    () => {
      const runAnimation = async () => {
        if (hasPlayedRef.current) return
        if (!textRef.current || !containerRef.current) return

        // Wait for preloader to complete (resolves immediately if skipped)
        await waitForReady()
        if (hasPlayedRef.current) return

        // Wait for SplitText to be ready
        await textRef.current.ready()
        if (hasPlayedRef.current) return

        const elements = textRef.current.getElements()
        const container = containerRef.current

        if (elements.length === 0 || !container) return

        hasPlayedRef.current = true

        gsap.set(container, { opacity: 1 })
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
    <Container className="w-full pb-8 md:py-8 font-medium">
      <div ref={containerRef} className="opacity-0">
        <SplitText ref={textRef} type="words">
          <ul className={cn(
            "flex flex-col gap-2 justify-center items-center",
            "md:flex-row md:gap-4",
            "uppercase font-serif font-semibold text-primary-base"
          )}>
            {COLLECTIONS.map(({ id, name, href }, index) => (
              <li key={id} className="flex flex-col md:flex-row items-center gap-2 leading-none">
                <UnderlineLink href={href} className="tracking-wider">
                  {name}
                </UnderlineLink>
                {index < COLLECTIONS.length - 1 && (
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