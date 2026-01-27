import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { RefObject } from "react"

import type { DialogAnimationState } from "../types"

type UseDialogAnimationOptions = {
  /** Current animation state */
  animationState: DialogAnimationState
  /** Ref to the overlay element */
  overlayRef: RefObject<HTMLDivElement | null>
  /** Ref to the panel element */
  panelRef: RefObject<HTMLDivElement | null>
  /** Panel position for slide direction */
  position: 'left' | 'right'
  /** Called when opening animation completes */
  onOpenComplete: () => void
  /** Called when closing animation completes */
  onCloseComplete: () => void
}

const ANIMATION_DURATION = 1
const EASE_IN = "gentleSlow"
const EASE_OUT = "power3.inOut"

/**
 * Hook that handles GSAP animations for dialog open/close transitions.
 * Animates both the overlay (fade) and panel (slide) elements.
 *
 * @param options - Animation configuration options
 */
export function useDialogAnimation({
  animationState,
  overlayRef,
  panelRef,
  position,
  onOpenComplete,
  onCloseComplete,
}: UseDialogAnimationOptions) {
  useGSAP(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current

    if (!overlay || !panel) return

    // Calculate slide direction based on position
    const slideOffset = position === 'right' ? '100%' : '-100%'

    if (animationState === 'opening') {
      // Set initial states
      gsap.set(overlay, { opacity: 0 })
      gsap.set(panel, { x: slideOffset })

      // Create opening timeline
      const tl = gsap.timeline({
        onComplete: onOpenComplete,
      })

      // Animate overlay fade in
      tl.to(overlay, {
        opacity: 1,
        duration: ANIMATION_DURATION,
        ease: EASE_IN,
      }, 0)

      // Animate panel slide in
      tl.to(panel, {
        x: 0,
        duration: ANIMATION_DURATION,
        ease: EASE_IN,
      }, 0)
    }

    if (animationState === 'closing') {
      // Create closing timeline
      const tl = gsap.timeline({
        onComplete: onCloseComplete,
      })

      // Animate overlay fade out
      tl.to(overlay, {
        opacity: 0,
        duration: ANIMATION_DURATION,
        ease: EASE_OUT,
      }, 0)

      // Animate panel slide out
      tl.to(panel, {
        x: slideOffset,
        duration: ANIMATION_DURATION,
        ease: EASE_OUT,
      }, 0)
    }
  }, { dependencies: [animationState, position] })
}
