"use client"

import { useLenis } from "lenis/react"
import { useEffect } from "react"

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

  useEffect(() => {
    if (!lenis) return

    if (disabledScroll) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [lenis, disabledScroll])
}