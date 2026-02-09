import { cn } from '@/lib/utils/helpers'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { ANIMATION_FROM_LEFT, ANIMATION_FROM_RIGHT, UNDERLINE_ANIMATION_CLASSES } from '../const'

type Direction = 'left' | 'right'

/**
 * Hook that manages the underline animation direction and classnames based on mouse entry point.
 *
 * Determines which direction the underline should animate from based on where
 * the mouse enters the element (left or right half). The direction is preserved
 * during mouse leave to allow the exit animation to reverse properly.
 *
 * Returns `underlineClassName` so callers do not need to wire animation classes
 * manually; merge it with any component-level className.
 *
 * @returns Object containing:
 * - `underlineClassName`: Tailwind classes for the full underline effect (base + direction)
 * - `handleMouseEnter`: Mouse enter handler that calculates direction
 * - `handleMouseLeave`: Mouse leave handler that resets direction after animation
 * - `elementRef`: Ref to attach to the animated element
 *
 * @example
 * ```tsx
 * const { underlineClassName, handleMouseEnter, handleMouseLeave, elementRef } = useUnderlineAnimation()
 *
 * <a
 *   ref={elementRef}
 *   className={cn(underlineClassName, className)}
 *   onMouseEnter={handleMouseEnter}
 *   onMouseLeave={handleMouseLeave}
 * >
 *   Content
 * </a>
 * ```
 */
export function useUnderlineAnimation<T extends HTMLElement = HTMLElement>() {
  const elementRef = useRef<T>(null)
  const [direction, setDirection] = useState<Direction | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = (e: MouseEvent<T>) => {
    if (!elementRef.current) return

    // Clear any pending timeout to prevent resetting direction during re-entry
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const { clientX } = e
    const { left, width } = elementRef.current.getBoundingClientRect()

    const centerX = left + width / 2
    const newDirection = clientX < centerX ? 'left' : 'right'

    setDirection(newDirection)
  }

  const handleMouseLeave = () => {
    // Keep direction state so exit animation knows which way to animate out
    // Only reset direction after animation completes (300ms matches transition duration)
    timeoutRef.current = setTimeout(() => {
      setDirection(null)
      timeoutRef.current = null
    }, 300)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const underlineClassName = cn(
    UNDERLINE_ANIMATION_CLASSES,
    direction === 'left' && ANIMATION_FROM_LEFT,
    direction === 'right' && ANIMATION_FROM_RIGHT
  )

  return {
    underlineClassName,
    handleMouseEnter,
    handleMouseLeave,
    elementRef,
  }
}
