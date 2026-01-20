"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Fragment, useRef } from "react"

import { SplitText, type SplitTextRef } from "@/components/effects/split-text"
import { UnderlineLink } from "@/components/effects/underline/underline-link"
import { orchestraMenuOverlay } from "@/lib/orchestra"
import { POLICIES_LINKS, SOCIAL_LINKS } from "@/lib/utils/config"
import { cn } from "@/lib/utils/helpers"


export function OverlayFooter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const splitTextRef = useRef<SplitTextRef>(null)

  useGSAP(() => {
    if (!splitTextRef.current) return

    const createAnimation = () => {
      if (!splitTextRef.current) return

      const elements = splitTextRef.current.getElements()

      if (elements.length === 0) return

      // Set initial state
      gsap.set(elements, { yPercent: 100 })

      // Animate to final state with stagger
      gsap.to(elements, {
        yPercent: 0,
        ...orchestraMenuOverlay.footerTexts,
      })
    }

    // Wait for split to be ready
    const checkReady = () => {
      if (!splitTextRef.current?.isReady()) {
        setTimeout(checkReady, 50)
        return
      }

      createAnimation()
    }

    checkReady()
  })

  return (
    <footer ref={containerRef}>
      <SplitText
        ref={splitTextRef}
        type="words"
        className={cn(
          "flex flex-col items-center gap-5 pb-4",
          "md:flex-row md:justify-between md:gap-8 md:pb-0"
        )}>
        <div className="flex items-center gap-2">
          <span>Socials — </span>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ id, href, label }) => (
              <div key={id}>
                [<UnderlineLink key={id} href={href}>{label}</UnderlineLink>]
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {POLICIES_LINKS.map(({ id, href, label }, index) => (
            <Fragment key={id}>
              <UnderlineLink href={href}>{label}</UnderlineLink>
              {index < POLICIES_LINKS.length - 1 && <span className="text-neutral-400">/</span>}
            </Fragment>
          ))}
        </div>
        <span>Designed with purpose</span>
      </SplitText>
    </footer>
  )
}