"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

import { type SplitTextRef, SplitText } from "@/components/effects/split-text";
import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { usePreloader } from "@/components/ui/preloader/hooks/use-preloader";
import { Text } from "@/components/ui/text";
import type { Menu } from '@/lib/integrations/shopify/types';
import { cn } from "@/lib/utils/helpers";
import { useNavigation } from "@/lib/utils/store";

const MOUNT_ANIMATION_CONFIG = {
  duration: 1,
  ease: "gentleSlow",
  stagger: 0.075,
  delay: 0.25,
} as const;


const RE_ANIMATE_DELAY = 0.1;

type HeroFooterProps = {
  menu: Menu[]
}

export function HeaderMenu({ menu }: HeroFooterProps) {
  const { navState } = useNavigation();

  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitTextRef>(null)
  const prevNavStateRef = useRef<string | null>(null)

  const { isReady: preloaderReady } = usePreloader()
  const [splitReady, setSplitReady] = useState(false)

  // Mount animation: runs once when preloader and split text are ready
  useGSAP(
    () => {
      if (!preloaderReady || !splitReady) return
      if (!textRef.current || !containerRef.current) return

      const elements = textRef.current.getElements()
      if (elements.length === 0) return

      gsap.set(containerRef.current, { opacity: 1 })
      gsap.fromTo(
        elements,
        { yPercent: 100 },
        { yPercent: 0, ...MOUNT_ANIMATION_CONFIG },
      )
    },
    {
      scope: containerRef,
      dependencies: [preloaderReady, splitReady]
    }
  );

  // Nav state: fade out on open, reset + re-animate on close
  useGSAP(
    () => {
      if (!wrapperRef.current) return

      const prevState = prevNavStateRef.current

      if (navState === 'opening') {
        // Fade the whole wrapper — underlines and text disappear together
        gsap.to(wrapperRef.current, { opacity: 0, duration: 0.3, ease: "gentleSlow" })
      } else if (navState === 'closed' && prevState === 'closing') {
        gsap.fromTo(wrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "gentleSlow", delay: RE_ANIMATE_DELAY })
      }

      prevNavStateRef.current = navState
    },
    { dependencies: [navState] }
  )

  return (
    <div ref={wrapperRef}>
      <div ref={containerRef} className="w-full font-medium opacity-0">
        <SplitText
          ref={textRef}
          type="words"
          onReady={() => setSplitReady(true)}
        >
          <ul className={cn(
            "flex flex-col gap-4 justify-center items-center",
            "md:flex-row md:gap-4",
          )}>
            {menu.map(({ title, path }, index) => (
              <li key={title} className="flex flex-col md:flex-row items-center gap-4">
                <UnderlineLink href={path} className="tracking-wider text-nowrap">
                  <Text as="span" preset="headerLink">{title}</Text>
                </UnderlineLink>
                {index < menu.length - 1 && (
                  <span className="text-zinc-600 hidden md:inline-block">|</span>
                )}
              </li>
            ))}
          </ul>
        </SplitText>
      </div>
    </div>
  )
}
