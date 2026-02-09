"use client"

import { useEffect, useEffectEvent, type RefObject } from "react"

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * Hook that traps focus within a container element.
 * Handles Tab and Shift+Tab navigation to cycle through focusable elements.
 *
 * @param containerRef - Ref to the container element
 * @param isActive - Whether the focus trap is active
 * @param onEscape - Optional callback when Escape is pressed
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onEscape?: () => void
) {
  // Effect Event to read latest onEscape without causing effect re-runs
  const handleEscape = useEffectEvent(() => {
    onEscape?.()
  })

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    // Store the element that was focused before opening
    const previouslyFocused = document.activeElement as HTMLElement | null

    // Focus the container or first focusable element
    const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
    const firstFocusable = focusableElements[0]

    // Focus first element after a small delay to ensure animations have started
    const focusTimeout = setTimeout(() => {
      if (firstFocusable) {
        firstFocusable.focus()
      } else {
        container.focus()
      }
    }, 50)

    function handleKeyDown(event: KeyboardEvent) {
      // Handle Escape key
      if (event.key === 'Escape') {
        event.preventDefault()
        handleEscape()
        return
      }

      // Handle Tab key for focus trapping
      if (event.key !== 'Tab') return

      // Re-query focusable elements in case DOM changed
      const currentFocusable = container?.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
      if (!currentFocusable || currentFocusable.length === 0) return

      const first = currentFocusable[0]
      const last = currentFocusable[currentFocusable.length - 1]

      // Shift + Tab on first element -> focus last
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
        return
      }

      // Tab on last element -> focus first
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(focusTimeout)
      document.removeEventListener('keydown', handleKeyDown)

      // Restore focus to previously focused element
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus()
      }
    }
  }, [isActive, containerRef])
}
