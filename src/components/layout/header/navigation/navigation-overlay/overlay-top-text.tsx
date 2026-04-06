"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useCallback, useRef } from "react"

import { SplitText, type SplitTextRef } from "@/components/effects/split-text"
import { Text } from "@/components/ui/text"
import { useBreakpoint } from "@/lib/hooks/use-breakpoint"
import { orchestraMenuOverlay } from "@/lib/orchestra"
import { cn } from "@/lib/utils/helpers"
import { useNavigation } from "@/lib/utils/store"

export function OverlayTopText() {
  const { navState, isNavOpen } = useNavigation()
  const { isMobile } = useBreakpoint()
  const splitTextRef = useRef<SplitTextRef>(null)
  const prevNavStateRef = useRef<typeof navState>(null)
  const isReadyRef = useRef(false)

  // Initialize text state when split is ready
  const handleReady = useCallback(() => {
    isReadyRef.current = true
    prevNavStateRef.current = navState
  }, [navState])

  // Animate text in/out based on navigation state
  useGSAP(() => {
    if (!isReadyRef.current || !splitTextRef.current) return

    // Skip animation on initial mount
    if (prevNavStateRef.current === null) {
      prevNavStateRef.current = navState
      return
    }

    const words = splitTextRef.current.getElements()
    const container = splitTextRef.current.getContainers()

    if (words.length === 0 || container.length === 0) return

    const prevIsNavOpen =
      prevNavStateRef.current === 'open' ||
      prevNavStateRef.current === 'opening'

    // Only animate if the open/closed state has actually changed
    if (prevIsNavOpen === isNavOpen) {
      prevNavStateRef.current = navState
      return
    }

    // Kill any ongoing animations to prevent overlap
    gsap.killTweensOf(words)

    // Set container opacity to 1 (remove opacity-0 class effect)
    gsap.set(container, {
      opacity: 1,
    })

    if (isNavOpen) {
      // Initial state - text hidden below
      gsap.set(words, {
        yPercent: 100,
      })

      // Navigation opening - animate text in
      gsap.to(words, {
        yPercent: 0,
        ...orchestraMenuOverlay.topText,
      })
    } else {
      // Navigation closing - animate text out
      gsap.to(words, {
        yPercent: -100,
        delay: 0.25,
        stagger: 0.03,
        duration: 0.4,
        ease: "power3.inOut"
      })
    }

    prevNavStateRef.current = navState
  }, { scope: splitTextRef, dependencies: [navState, isMobile] })

  return (
    <SplitText
      ref={splitTextRef}
      type="words"
      onReady={handleReady}
      className={cn(
        "font-normal tracking-wide text-zinc-300 leading-normal",
        "opacity-0 word:inline-block"
      )}
    >
      <Text preset="body">Curated artistry for modern interiors</Text>
    </SplitText>
  )
}
