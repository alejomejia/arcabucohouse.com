"use client"

import type { ButtonHTMLAttributes, MouseEvent } from "react"

import { cn } from "@/lib/utils/helpers"

import { useUnderlineAnimation } from "./hooks/use-underline-animation"
import { useUnderlineCursor } from "./hooks/use-underline-cursor"

export type UnderlineButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** When true, the custom cursor is not used on hover (default: false) */
  disableCursor?: boolean
}

/**
 * Renders a button with animated underline and custom cursor on hover.
 *
 * Wraps a button element with a CSS-based underline animation and cursor effect.
 * The underline slides in from the direction opposite to where the mouse entered.
 * Uses custom easing from `--custom-ease-in-out`.
 *
 * @param className - Additional CSS classes to merge with underline styles
 * @param children - Button content (text or elements)
 * @param disableCursor - When true, custom cursor is disabled (default: false)
 * @param props - All other ButtonHTMLAttributes (onClick, type, disabled, etc.)
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
  disableCursor = false,
  onMouseEnter,
  onMouseLeave,
  ...props
}: UnderlineButtonProps) {
  const { cursorEnter, cursorLeave } = useUnderlineCursor(disableCursor, "internal")
  const { underlineClassName, handleMouseEnter: underlineEnter, handleMouseLeave: underlineLeave, elementRef } =
    useUnderlineAnimation<HTMLButtonElement>()

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    underlineEnter(e)
    cursorEnter()
    onMouseEnter?.(e)
  }
  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    underlineLeave()
    cursorLeave()
    onMouseLeave?.(e)
  }

  return (
    <button
      ref={elementRef}
      className={cn(underlineClassName, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  )
}
