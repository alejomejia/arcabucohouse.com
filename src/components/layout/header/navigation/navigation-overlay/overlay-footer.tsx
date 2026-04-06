"use client"

import gsap from "gsap"
import { Fragment, useRef } from "react"

import { SplitText } from "@/components/effects/split-text"
import { UnderlineLink } from "@/components/effects/underline/underline-link"
import { Text } from "@/components/ui/text"
import { POLICIES_LINKS, SOCIAL_MEDIA_LINKS } from "@/lib/constants/links"
import { orchestraMenuOverlay } from "@/lib/orchestra"
import { cn } from "@/lib/utils/helpers"

export function OverlayFooter() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <footer ref={containerRef}>
      <SplitText
        type="words"
        onReady={(elements) => {
          gsap.set(elements, { yPercent: 100 })
          gsap.to(elements, {
            yPercent: 0,
            ...orchestraMenuOverlay.footerTexts,
          })
        }}
        className={cn(
          "flex flex-col items-center gap-5 pb-4",
          "md:flex-row md:justify-between md:gap-8 md:pb-0"
        )}>
        <div className="flex items-center gap-2">
          <span>Socials — </span>
          <div className="flex items-center gap-2">
            {SOCIAL_MEDIA_LINKS.map(({ id, href, label }) => (
              <div key={id}>
                [<UnderlineLink key={id} href={href}>{label}</UnderlineLink>]
              </div>
            ))}
          </div>
        </div>
        <Text preset="body" className="text-zinc-300 text-base">Curated artistry for modern interiors</Text>
        <div className="flex items-center gap-2">
          {POLICIES_LINKS.map(({ id, href, label }, index) => (
            <Fragment key={id}>
              <UnderlineLink href={href}>{label}</UnderlineLink>
              {index < POLICIES_LINKS.length - 1 && <span className="text-neutral-400">/</span>}
            </Fragment>
          ))}
        </div>
      </SplitText>
    </footer>
  )
}
