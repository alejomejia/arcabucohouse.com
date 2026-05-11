import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { RefObject } from "react"

import { DIALOG_ANIMATION_DURATION, DIALOG_EASE_IN, DIALOG_EASE_OUT } from "../dialog.const"
import type { DialogAnimationState } from "../dialog.types"

type UseDialogAnimationOptions = {
  /** Current animation state */
  animationState: DialogAnimationState
  /** Ref to the overlay element */
  overlayRef: RefObject<HTMLDivElement | null>
  /** Ref to the panel element */
  panelRef: RefObject<HTMLDivElement | null>
  /** Called when opening animation completes */
  onOpenComplete: () => void
  /** Called when closing animation completes */
  onCloseComplete: () => void
}

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
  onOpenComplete,
  onCloseComplete,
}: UseDialogAnimationOptions) {
  useGSAP(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current

    if (!overlay || !panel) return

    if (animationState === 'opening') {
      // Set initial states and promote to own layer
      gsap.set(panel, { x: "100%", willChange: "transform" })
      gsap.set(overlay, { willChange: "opacity" })

      // Defer animation by one GSAP tick so the browser can paint the newly
      // mounted Dialog Portal before the slide/fade animation starts.
      // Without this, mount + layout + paint + animation compete in one frame.
      gsap.delayedCall(0, () => {
        if (!overlayRef.current || !panelRef.current) return

        const tl = gsap.timeline({
          onComplete: () => {
            // Clean up will-change to free GPU memory
            if (panelRef.current) panelRef.current.style.willChange = "auto"
            if (overlayRef.current) overlayRef.current.style.willChange = "auto"
            onOpenComplete()
          },
        })

        tl.to(overlay, {
          opacity: 1,
          duration: DIALOG_ANIMATION_DURATION,
          ease: DIALOG_EASE_IN,
        }, 0)

        tl.to(panel, {
          x: 0,
          duration: DIALOG_ANIMATION_DURATION,
          ease: DIALOG_EASE_IN,
        }, 0)
      })
    }

    if (animationState === 'closing') {
      gsap.set(panel, { willChange: "transform" })
      gsap.set(overlay, { willChange: "opacity" })

      const tl = gsap.timeline({
        onComplete: () => {
          if (panelRef.current) panelRef.current.style.willChange = "auto"
          if (overlayRef.current) overlayRef.current.style.willChange = "auto"
          onCloseComplete()
        },
      })

      tl.to(overlay, {
        opacity: 0,
        duration: DIALOG_ANIMATION_DURATION,
        ease: DIALOG_EASE_OUT,
      }, 0)

      tl.to(panel, {
        x: "100%",
        duration: DIALOG_ANIMATION_DURATION,
        ease: DIALOG_EASE_OUT,
      }, 0)
    }
  }, { scope: panelRef, dependencies: [animationState] })
}
