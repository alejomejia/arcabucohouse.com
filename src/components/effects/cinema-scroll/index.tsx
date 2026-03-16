'use client'

import type { ReactNode } from 'react'

import { cn, toCSSVars } from '@/lib/utils/helpers'

import { CinemaScrollMarquee } from './cinema-scroll-marquee'
import { CinemaScrollPanel } from './cinema-scroll-panel'
import { CinemaScrollPanels } from './cinema-scroll-panels'
import { DARK_COLOR, LIGHT_COLOR } from './cinema-scroll.const'
import { CinemaScrollContext } from './cinema-scroll.context'
import { useCinemaScroll } from './use-cinema-scroll'

type CinemaScrollProps = {
  children?: ReactNode
  className?: string
  /** Background color when fully scrolled out. Defaults to `#fafafa`. */
  startColor?: string
  /** Background color when fully scrolled in. Defaults to `#252525`. */
  endColor?: string
}

/**
 * Root of the CinemaScroll effect. Manages all GSAP scroll animation state
 * and provides refs + color tokens to sub-components via context.
 *
 * @example
 * ```tsx
 * <CinemaScroll startColor="#fafafa" endColor="#252525">
 *   <CinemaScroll.Marquee images={images} pinImageIndex={6} />
 *   <CinemaScroll.Panels>
 *     <CinemaScroll.Panel>
 *       <CinemaScroll.Panel.Content>…</CinemaScroll.Panel.Content>
 *       <CinemaScroll.Panel.Image src="…" alt="…" />
 *     </CinemaScroll.Panel>
 *   </CinemaScroll.Panels>
 * </CinemaScroll>
 * ```
 */
function CinemaScrollRoot({
  children,
  className,
  startColor = LIGHT_COLOR,
  endColor = DARK_COLOR,
}: CinemaScrollProps) {
  const refs = useCinemaScroll(startColor, endColor)

  return (
    <CinemaScrollContext.Provider value={{ ...refs, startColor, endColor }}>
      <div
        ref={refs.containerRef}
        className={cn('relative w-full bg-(--start-bg-color) will-change-[background-color]', className)}
        style={toCSSVars({ 'bg-color': startColor })}
      >
        {children}
      </div>
    </CinemaScrollContext.Provider>
  )
}

/** @see {@link CinemaScrollRoot} for full usage docs. */
export const CinemaScroll = Object.assign(CinemaScrollRoot, {
  /** @see {@link CinemaScrollMarquee} */
  Marquee: CinemaScrollMarquee,
  /** @see {@link CinemaScrollPanels} */
  Panels: CinemaScrollPanels,
  /** @see {@link CinemaScrollPanel} */
  Panel: CinemaScrollPanel,
})

export type * from './cinema-scroll.types'
