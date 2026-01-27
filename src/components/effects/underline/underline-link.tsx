"use client"

import { Link, type LinkProps } from '@/components/ui/link'
import { cn } from '@/lib/utils/helpers'
import { useUnderlineAnimation } from './use-underline-animation'

/**
 * Renders a link with animated underline effect on hover.
 *
 * Wraps the base Link component with a CSS-based underline animation.
 * The underline slides in from the direction opposite to where the mouse
 * entered (left or right side of the link). On mouse leave, it animates
 * out in the reverse direction. Uses custom easing function from CSS
 * variable `--custom-ease-in-out`.
 *
 * The animation direction is determined by the mouse entry point:
 * - Entering from the left half: underline slides from right to left
 * - Entering from the right half: underline slides from left to right
 *
 * @param className - Additional CSS classes to merge with underline styles
 * @param children - Link content (text or elements)
 * @param props - All other LinkProps (href, onClick, scroll, etc.)
 * @returns Link component with animated underline effect
 *
 * @example
 * ```tsx
 * <UnderlineLink href="/about" className="text-blue-600">
 *   About Us
 * </UnderlineLink>
 * ```
 */
export function UnderlineLink({ className, children, ...props }: LinkProps) {
  const { underlineClassName, handleMouseEnter, handleMouseLeave, elementRef } =
    useUnderlineAnimation<HTMLAnchorElement>()

  return (
    <Link
      ref={elementRef}
      className={cn(underlineClassName, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Link>
  )
}

