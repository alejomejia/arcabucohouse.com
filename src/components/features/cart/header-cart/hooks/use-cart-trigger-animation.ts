import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

import { type SplitTextRef } from '@/components/effects/split-text'
import { usePreloader } from '@/components/ui/preloader/hooks/use-preloader'

const ANIMATION_CONFIG = {
  duration: 0.5,
  delay: 0.75, // Relative delay after preloader (staggered with other header elements)
  stagger: 0.05,
  ease: "gentleSlow",
} as const;

/**
 * Hook to handle GSAP animation for the cart trigger button.
 * Waits for preloader to complete before animating.
 *
 * @returns A ref to attach to the SplitText component
 */
export function useCartTriggerAnimation(quantity: number) {
  const cartRef = useRef<SplitTextRef>(null)
  const hasPlayedIntroRef = useRef(false)
  const { waitForReady } = usePreloader()

  // Initial mount animation - waits for preloader
  useGSAP(() => {
    if (!cartRef.current) return
    if (hasPlayedIntroRef.current) return

    const runAnimation = async () => {
      if (hasPlayedIntroRef.current) return
      if (!cartRef.current) return

      // Wait for preloader to complete (resolves immediately if skipped)
      await waitForReady()
      if (hasPlayedIntroRef.current) return

      // Wait for SplitText to be ready
      await cartRef.current.ready()
      if (hasPlayedIntroRef.current) return

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
    }

    runAnimation()
  }, { scope: cartRef })

  // Handle quantity changes (after initial animation)
  useGSAP(() => {
    if (!cartRef.current) return
    if (!hasPlayedIntroRef.current) return // Skip if intro hasn't played

    const updateContainer = async () => {
      if (!cartRef.current) return

      // Wait for SplitText to be ready (no polling!)
      await cartRef.current.ready()

      const container = cartRef.current.getContainers()
      if (container.length === 0) return

      gsap.set(container, { opacity: 1 })
    }

    updateContainer()
  }, { scope: cartRef, dependencies: [quantity] })

  return cartRef
}
