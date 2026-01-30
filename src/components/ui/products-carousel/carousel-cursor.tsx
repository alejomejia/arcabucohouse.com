import { type ReactNode } from "react"

import { CURSOR_SCROLL, CURSOR_SMALL } from "@/components/effects/cursor/cursor-states"
import { CursorTrigger } from "@/components/effects/cursor/cursor-trigger"

type CarouselCursorProps = {
  /** When true, the cursor is with text (e.g. while scrolling or when carousel is not active). */
  isScrolling: boolean
  children: ReactNode
}

export function CarouselCursor({ isScrolling, children }: CarouselCursorProps) {
  const conditionalConfig = !isScrolling ? CURSOR_SCROLL : CURSOR_SMALL

  return (
    <CursorTrigger config={conditionalConfig}>
      {children}
    </CursorTrigger>
  )
}