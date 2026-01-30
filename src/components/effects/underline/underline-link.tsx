"use client"

import type { MouseEvent } from "react"

import { Link, type LinkProps } from "@/components/ui/link"
import { cn } from "@/lib/utils/helpers"

import { useIsExternal } from "./hooks/use-is-external"
import { useUnderlineAnimation } from "./hooks/use-underline-animation"
import { useUnderlineCursor } from "./hooks/use-underline-cursor"

export type UnderlineLinkProps = LinkProps & {
  /** When true, the custom cursor is not used on hover (default: false) */
  disableCursor?: boolean
}

/**
 * Renders a link with animated underline and custom cursor on hover.
 *
 * Wraps the base Link component with a CSS-based underline animation and
 * cursor effect. The underline slides in from the direction opposite to
 * where the mouse entered. External links show an arrow cursor; internal
 * links show a subtle scale. Uses custom easing from `--custom-ease-in-out`.
 *
 * @param className - Additional CSS classes to merge with underline styles
 * @param children - Link content (text or elements)
 * @param disableCursor - When true, custom cursor is disabled (default: false)
 * @param props - All other LinkProps (href, onClick, scroll, etc.)
 *
 * @example
 * ```tsx
 * <UnderlineLink href="/about" className="text-blue-600">
 *   About Us
 * </UnderlineLink>
 * ```
 */
export function UnderlineLink({
  className,
  children,
  disableCursor = false,
  href,
  onMouseEnter,
  onMouseLeave,
  ...props
}: UnderlineLinkProps) {
  const isExternal = useIsExternal(href)
  const { cursorEnter, cursorLeave } = useUnderlineCursor(
    disableCursor,
    isExternal ? "external" : "internal"
  )
  const { underlineClassName, handleMouseEnter: underlineEnter, handleMouseLeave: underlineLeave, elementRef } =
    useUnderlineAnimation<HTMLAnchorElement>()

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    underlineEnter(e)
    cursorEnter()
    onMouseEnter?.(e)
  }
  const handleMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    underlineLeave()
    cursorLeave()
    onMouseLeave?.(e)
  }

  return (
    <Link
      ref={elementRef}
      className={cn(underlineClassName, className)}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Link>
  )
}

