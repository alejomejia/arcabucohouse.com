'use client'

import { createContext, useContext } from 'react'

import type { CinemaScrollRefs } from './use-cinema-scroll'

export type CinemaScrollContextValue = CinemaScrollRefs & {
  /** Background color when the section is fully scrolled out. */
  startColor: string
  /** Background color when the section is fully scrolled in. */
  endColor: string
}

/**
 * Internal context that distributes GSAP refs and color tokens from the
 * `CinemaScroll` root to all sub-components without explicit prop threading.
 */
export const CinemaScrollContext = createContext<CinemaScrollContextValue | null>(null)

/**
 * Consume the `CinemaScrollContext`. Throws a descriptive error if called
 * outside of a `<CinemaScroll>` tree, surfacing misuse at development time.
 */
export function useCinemaScrollContext(): CinemaScrollContextValue {
  const ctx = useContext(CinemaScrollContext)
  if (!ctx) throw new Error('CinemaScroll sub-components must be rendered inside <CinemaScroll>')
  return ctx
}
