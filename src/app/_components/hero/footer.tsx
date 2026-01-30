"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { type SplitTextRef, SplitText } from "@/components/effects/split-text";
import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Container } from "@/components/ui/container";
import { orchestraHomeHero } from "@/lib/orchestra";

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

  useGSAP(() => {
    const createAnimation = () => {
      if (!textRef.current || !containerRef.current) return

      const elements = textRef.current.getElements()
      const container = containerRef.current

      if (elements.length === 0 || !container) return

      gsap.set(container, { opacity: 1 })
      gsap.set(elements, { yPercent: 100 })
      gsap.fromTo(elements, { yPercent: 100 }, { yPercent: 0, ...orchestraHomeHero.footer })
    }

    // Wait for split to be ready
    const checkReady = () => {
      if (!textRef.current?.isReady()) {
        setTimeout(checkReady, 50)
        return
      }

      createAnimation()
    }

    checkReady()
  }, { scope: containerRef })

  return (
    <Container className="w-full py-8 font-medium">
      <div ref={containerRef} className="opacity-0">
        <SplitText ref={textRef} type="words">
          <div className="flex justify-between items-end gap-8">
            <div className="flex-1">
              <p className="text-balance max-w-96">Design objects born in Latin America, curated for modern living</p>
            </div>
            <div className="flex-1">
              <ul className="flex gap-4 justify-center items-center text-primary-base">
                {COLLECTIONS.map(({ id, name, href }, index) => (
                  <li key={id} className="flex items-center gap-2">
                    <UnderlineLink href={href}>{name}</UnderlineLink>
                    {index < COLLECTIONS.length - 1 && <span className="text-neutral-400">/</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <p className="text-balance max-w-96 text-right ml-auto">Artisan-made interiors from the heart of Latin America</p>
            </div>
          </div>
        </SplitText>
      </div>
    </Container>
  )
}