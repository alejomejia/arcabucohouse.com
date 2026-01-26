import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

import { type SplitTextRef } from '@/components/effects/split-text'
import { orchestraNavigation } from '@/lib/orchestra'

/**
 * Hook to handle GSAP animation for the cart trigger button.
 *
 * @returns A ref to attach to the SplitText component
 */
export function useCartTriggerAnimation(quantity: number) {
  const cartRef = useRef<SplitTextRef>(null)

  useGSAP(() => {
    if (!cartRef.current) return

    const createAnimation = () => {
      if (!cartRef.current) return

      const chars = cartRef.current.getElements()
      const container = cartRef.current.getContainers()

      if (chars.length === 0 || container.length === 0) return

      // Set initial state
      gsap.set(chars, { yPercent: 100 })
      gsap.set(container, { opacity: 1 })

      // Animate to final state with stagger
      gsap.to(chars, {
        yPercent: 0,
        ...orchestraNavigation.cart,
      })
    }

    // Wait for split to be ready
    const checkReady = () => {
      if (!cartRef.current?.isReady()) {
        setTimeout(checkReady, 50)
        return
      }

      createAnimation()
    }

    checkReady()
  }, { scope: cartRef })

  // Animate container opacity on quantity change
  useGSAP(() => {
    if (!cartRef.current) return

    // Wait for split to be ready before accessing containers
    const checkReady = () => {
      if (!cartRef.current?.isReady()) {
        setTimeout(checkReady, 50)
        return
      }

      const container = cartRef.current.getContainers()
      if (container.length === 0) return

      gsap.set(container, { opacity: 1 })
    }

    checkReady()
  }, { scope: cartRef, dependencies: [quantity] })

  return cartRef
}
