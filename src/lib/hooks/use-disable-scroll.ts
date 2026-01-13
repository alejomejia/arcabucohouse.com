"use client"

import { useLenis } from "lenis/react"
import { useEffect, useRef } from "react"

const OVERFLOW_HIDDEN_CLASS = 'overflow-hidden'

/**
 * Disables or enables scroll for both Lenis and the document element.
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
    // SSR safety check
    if (typeof window === 'undefined') {
      return
    }

    const htmlElement = document.documentElement
    const hasOverflowHidden = htmlElement.classList.contains(OVERFLOW_HIDDEN_CLASS)

    if (disabledScroll) {
      // Disable scroll
      lenis?.stop()
      
      if (!hasOverflowHidden) {
        htmlElement.classList.add(OVERFLOW_HIDDEN_CLASS)
      }
      wasDisabledRef.current = true
    } else {
      // Enable scroll
      lenis?.start()
      if (hasOverflowHidden) {
        htmlElement.classList.remove(OVERFLOW_HIDDEN_CLASS)
      }
      wasDisabledRef.current = false
    }

    // Cleanup: restore scroll state on unmount only if we disabled it
    return () => {
      if (wasDisabledRef.current && typeof window !== 'undefined') {
        lenis?.start()
        const htmlElement = document.documentElement
        if (htmlElement.classList.contains(OVERFLOW_HIDDEN_CLASS)) {
          htmlElement.classList.remove(OVERFLOW_HIDDEN_CLASS)
        }
        wasDisabledRef.current = false
      }
    }
  }, [lenis, disabledScroll])
}