'use client'

import { ArrowUpRightIcon } from '@heroicons/react/24/outline'

import type { CursorConfig } from './types'

/** 
 * Cursor with "Scroll" label and large scale. 
 * Use for horizontal/vertical scroll areas (e.g. carousels). */
export const CURSOR_SCROLL: CursorConfig = {
  text: 'Scroll',
  scale: 3,
  contentClassName: 'uppercase font-semibold text-[0.5rem] tracking-widest',
}

/** Hover zone where the cursor is hidden. Use for custom interactive areas (e.g. canvas, custom controls). */
export const CURSOR_HIDDEN: CursorConfig = {
  hidden: true,
}

/** Large cursor (3x). Use for big clickable areas or emphasis. */
export const CURSOR_LARGE: CursorConfig = {
  scale: 3,
}

/** Small cursor (0.5x) with dot. Use for minimal or dense UI. */
export const CURSOR_SMALL: CursorConfig = {
  scale: 0.5,
}

/** Slightly scaled cursor (1.5x). Use for internal links or buttons. */
export const CURSOR_MEDIUM: CursorConfig = {
  scale: 1.25,
}

/** External link: arrow icon and large scale. Use for external links (e.g. underline link with arrow). */
export const CURSOR_LINK_EXTERNAL: CursorConfig = {
  content: <ArrowUpRightIcon className="size-4" aria-hidden />,
  scale: 2,
}