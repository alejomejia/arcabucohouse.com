"use client"

import { useLenis } from "lenis/react"
import { useEffect, useRef } from "react"

/**
 * Disables or enables Lenis scroll in the document.
 * 
 * @param disabledScroll - Whether to disable scroll (true) or enable it (false)
 * 
 * @example
 * ```tsx
 * function Modal({ isOpen }: { isOpen: boolean }) {
 *   useDisableScroll(isOpen)
 *   return isOpen ? <div>Modal content</div> : null
 * }
 * ```
 */
export function useDisableScroll(disabledScroll: boolean) {
  const lenis = useLenis()
  const wasDisabledRef = useRef(false)

  useEffect(() => {
    if (!lenis) return

    if (disabledScroll) {
      lenis.stop()
      wasDisabledRef.current = true
    } else {
      lenis.start()
      wasDisabledRef.current = false
    }

    // Cleanup: restore scroll state on unmount only if we disabled it
    return () => {
      if (!lenis) return

      if (wasDisabledRef.current) {
        lenis.start()
        wasDisabledRef.current = false
      }
    }
  }, [lenis, disabledScroll])
}