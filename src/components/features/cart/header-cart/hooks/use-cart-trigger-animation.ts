import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCallback, useRef, useState } from 'react'

import { type SplitTextRef } from '@/components/effects/split-text'
import { usePreloader } from '@/components/ui/preloader/hooks/use-preloader'

const ANIMATION_CONFIG = {
  duration: 0.5,
  delay: 0.75, // Relative delay after preloader (staggered with other header elements)
  stagger: 0.05,
  ease: "gentleSlow",
} as const;

/**
 * Manages GSAP animation for the cart trigger button.
 *
 * Waits for both preloader completion and SplitText readiness before
 * playing the intro animation. On quantity changes (SplitText remounts),
 * the onReady handler sets container opacity directly.
 *
 * @returns Object with cartRef and onSplitReady to attach to SplitText
 */
export function useCartTriggerAnimation(quantity: number) {
  const cartRef = useRef<SplitTextRef>(null)
  const hasPlayedIntroRef = useRef(false)

  const { isReady: preloaderReady } = usePreloader()
  const [splitReady, setSplitReady] = useState(false)

  // Called by SplitText onReady — handles both initial mount and remounts
  const onSplitReady = useCallback((_elements: HTMLElement[], containers: HTMLElement[]) => {
    if (!hasPlayedIntroRef.current) {
      // First mount: signal readiness for the preloader-dependent animation
      setSplitReady(true)
      return
    }

    // Subsequent mounts (quantity change): set container visible directly
    if (containers.length > 0) {
      gsap.set(containers, { opacity: 1 })
    }
  }, [])

  // Initial mount animation — runs when both preloader and split are ready
  useGSAP(() => {
    if (hasPlayedIntroRef.current) return
    if (!preloaderReady || !splitReady || !cartRef.current) return

    const chars = cartRef.current.getElements()
    const container = cartRef.current.getContainers()

    if (chars.length === 0 || container.length === 0) return

    hasPlayedIntroRef.current = true

    // Set initial state
    gsap.set(chars, { yPercent: 100 })
    gsap.set(container, { opacity: 1 })

    // Animate to final state
    gsap.to(chars, {
      yPercent: 0,
      ...ANIMATION_CONFIG,
    })
  }, { scope: cartRef, dependencies: [preloaderReady, splitReady] })

  return { cartRef, onSplitReady }
}
