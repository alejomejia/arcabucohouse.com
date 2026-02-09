"use client"

import { useCallback } from "react"

import { useCursor } from "@/components/effects/cursor/context"
import { CURSOR_LINK_EXTERNAL, CURSOR_MEDIUM } from "@/components/effects/cursor/cursor-states"

export type UnderlineCursorVariant = "internal" | "external"

/**
 * Provides cursor event handlers for underline links and buttons.
 *
 * When the cursor is enabled, external links show an arrow icon at larger scale;
 * internal links and buttons show a subtle scale. Mouse leave resets to the default cursor.
 * All handlers no-op when the cursor is disabled.
 *
 * @param disableCursor - When true, all handlers no-op and the custom cursor is not used
 * @param variant - "external" for external links (arrow), "internal" for internal links or buttons (default)
 * @returns Handlers to attach: cursorEnter, cursorLeave
 *
 * @example
 * ```tsx
 * // UnderlineLink with external/internal based on href
 * const isExternal = useIsExternal(href)
 * const { cursorEnter, cursorLeave } = useUnderlineCursor(false, isExternal ? 'external' : 'internal')
 *
 * // UnderlineButton
 * const { cursorEnter, cursorLeave } = useUnderlineCursor(false, 'internal')
 * ```
 */
export function useUnderlineCursor(
  disableCursor = false,
  variant: UnderlineCursorVariant = "internal"
) {
  const { setHover, setDefault } = useCursor()

  const cursorEnter = useCallback(() => {
    if (disableCursor) return
    if (variant === "external") {
      setHover(CURSOR_LINK_EXTERNAL)
    } else {
      setHover(CURSOR_MEDIUM)
    }
  }, [disableCursor, variant, setHover])

  const cursorLeave = useCallback(() => {
    if (disableCursor) return
    setDefault()
  }, [disableCursor, setDefault])

  return { cursorEnter, cursorLeave }
}
