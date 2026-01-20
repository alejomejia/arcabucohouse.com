"use client"

import { cn } from '@/lib/utils/helpers'

import type { ButtonHTMLAttributes } from 'react'
import { ANIMATION_FROM_LEFT, ANIMATION_FROM_RIGHT, UNDERLINE_ANIMATION_CLASSES } from './const'
import {
  useUnderlineAnimation,
} from './use-underline-animation'

export type UnderlineButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Renders a button with animated underline effect on hover.
 *
 * Wraps a button element with a CSS-based underline animation.
 * The underline slides in from the direction opposite to where the mouse
 * entered (left or right side of the button). On mouse leave, it animates
 * out in the reverse direction. Uses custom easing function from CSS
 * variable `--custom-ease-in-out`.
 *
 * The animation direction is determined by the mouse entry point:
 * - Entering from the left half: underline slides from right to left
 * - Entering from the right half: underline slides from left to right
 *
 * @param className - Additional CSS classes to merge with underline styles
 * @param children - Button content (text or elements)
 * @param props - All other ButtonHTMLAttributes (onClick, type, disabled, etc.)
 * @returns Button component with animated underline effect
 *
 * @example
 * ```tsx
 * <UnderlineButton onClick={handleClick} className="text-blue-600">
 *   Click Me
 * </UnderlineButton>
 * ```
 */
export function UnderlineButton({
  className,
  children,
  ...props
}: UnderlineButtonProps) {
  const { direction, handleMouseEnter, handleMouseLeave, elementRef } =
    useUnderlineAnimation<HTMLButtonElement>()

  return (
    <button
      ref={elementRef}
      className={cn(
        UNDERLINE_ANIMATION_CLASSES,
        {
          [ANIMATION_FROM_LEFT]: direction === 'left',
          [ANIMATION_FROM_RIGHT]: direction === 'right',
        },
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  )
}
