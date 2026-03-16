'use client'

import type { ReactNode } from 'react'

import { Image } from '@/components/ui/image'
import { cn, toCSSVars } from '@/lib/utils/helpers'

import { useCinemaScrollContext } from './cinema-scroll.context'

type CinemaScrollPanelProps = {
  children: ReactNode
  className?: string
}

/**
 * A single content panel inside `<CinemaScroll.Panels>`.
 *
 * Compose with `<CinemaScroll.Panel.Content>` and `<CinemaScroll.Panel.Image>`
 * to build each slide. Background and text colors are inherited from the root
 * `<CinemaScroll>` `endColor` / `startColor` props via context.
 *
 * Must be rendered inside `<CinemaScroll.Panels>`.
 *
 * @example
 * ```tsx
 * <CinemaScroll.Panel>
 *   <CinemaScroll.Panel.Content>
 *     <p>Your copy here</p>
 *   </CinemaScroll.Panel.Content>
 *   <CinemaScroll.Panel.Image src="/photo.jpg" alt="Description" />
 * </CinemaScroll.Panel>
 * ```
 */
function CinemaScrollPanelRoot({ children, className }: CinemaScrollPanelProps) {
  const { startColor, endColor } = useCinemaScrollContext()
  return (
    <div
      className={cn(
        'flex-1 h-full p-16 lg:p-8',
        'flex gap-8 flex-col-reverse lg:flex-row',
        'bg-(--end-color) text-(--text-color)',
        className,
      )}
      style={toCSSVars({ "end-color": endColor, "text-color": startColor })}
    >
      {children}
    </div>
  )
}

type CinemaScrollPanelContentProps = {
  children: ReactNode
  className?: string
}

/**
 * Text/content column inside a `<CinemaScroll.Panel>`.
 * Takes up `flex-3` of the panel width (≈ 60 %) and centers its children
 * vertically on desktop, aligning to the start on mobile.
 */
function CinemaScrollPanelContent({ children, className }: CinemaScrollPanelContentProps) {
  return (
    <div className={cn('flex-3 flex justify-center items-start lg:items-center', className)}>
      {children}
    </div>
  )
}

type CinemaScrollPanelImageProps = {
  src: string
  alt: string
  className?: string
}

/**
 * Image column inside a `<CinemaScroll.Panel>`.
 * Takes up `flex-2` of the panel width (≈ 40 %) and renders the image at
 * `size-3/4 object-cover`, expanding to full width/height on mobile.
 */
function CinemaScrollPanelImage({ src, alt, className }: CinemaScrollPanelImageProps) {
  return (
    <div className="flex-2 flex justify-center items-center">
      <Image
        src={src}
        alt={alt}
        className={cn('w-full h-full lg:size-3/4 object-cover', className)}
      />
    </div>
  )
}

/** @see {@link CinemaScrollPanelRoot} for full usage docs. */
export const CinemaScrollPanel = Object.assign(CinemaScrollPanelRoot, {
  Content: CinemaScrollPanelContent,
  Image: CinemaScrollPanelImage,
})
