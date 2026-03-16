'use client'

import { Children, type ReactNode } from 'react'

import { toCSSVars } from '@/lib/utils/helpers'
import { useCinemaScrollContext } from './cinema-scroll.context'

type CinemaScrollPanelsProps = {
  /** One or more `<CinemaScroll.Panel>` elements. */
  children: ReactNode
}

/**
 * Horizontal scroll container. Pins itself for `5 × viewport height` of scroll
 * budget and slides its children into view as the user scrolls.
 *
 * Width is computed automatically from the number of `<CinemaScroll.Panel>` children —
 * add or remove panels without touching any animation config.
 *
 * Must be rendered inside `<CinemaScroll>`.
 *
 * @example
 * ```tsx
 * <CinemaScroll.Panels>
 *   <CinemaScroll.Panel>…</CinemaScroll.Panel>
 *   <CinemaScroll.Panel>…</CinemaScroll.Panel>
 * </CinemaScroll.Panels>
 * ```
 */
export function CinemaScrollPanels({ children }: CinemaScrollPanelsProps) {
  const { horizontalScrollRef, horizontalWrapperRef } = useCinemaScrollContext()

  // Width is 100 % per panel + 100 % for the leading spacer that conceals
  // the expanding clone during the Flip transition.
  const panelCount = Children.count(children)
  const wrapperWidth = `${(panelCount + 1) * 100}%`

  // calc(100% / N) in the wrapper context equals exactly one section-width.
  // Using flex-none + an explicit width avoids sub-pixel rounding in the flex
  // algorithm that can let a sliver of the first dark panel bleed through the
  // right edge before the animation starts. 100vw is intentionally avoided to
  // prevent the scrollbar from adding an unwanted horizontal gap.
  const spacerWidth = `calc(100% / ${panelCount + 1})`

  return (
    <section ref={horizontalScrollRef} className="relative w-full h-svh overflow-hidden">
      <div
        ref={horizontalWrapperRef}
        className="relative flex h-svh will-change-transform w-(--wrapper-width)"
        style={toCSSVars({ 'wrapper-width': wrapperWidth })}
      >
        {/* Spacer panel — transparent so the expanding clone is visible beneath.
            flex-none + explicit calc width guarantees a hard section-width,
            preventing the adjacent dark panel from bleeding through the right edge. */}
        <div
          className="flex-none h-full w-(--spacer-width)"
          style={toCSSVars({ "spacer-width": spacerWidth })}
        />
        {children}
      </div>
    </section>
  )
}
