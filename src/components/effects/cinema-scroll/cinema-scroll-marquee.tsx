'use client'

import { useLayoutEffect } from 'react'

import { Image } from '@/components/ui/image'
import { toCSSVars } from '@/lib/utils/helpers'
import { useCinemaScrollContext } from './cinema-scroll.context'
import type { MarqueeImage } from './cinema-scroll.types'

export type CinemaScrollMarqueeProps = {
  /**
   * All images rendered in the horizontal strip.
   *
   * **Constraints** (validated at runtime):
   * - Minimum 13 items — fewer images crop on wide viewports.
   * - Must be an odd count — ensures the pin image can sit at the exact center slot.
   * - `pinImageIndex` must be a valid index within this array.
   */
  images: MarqueeImage[]
  /**
   * Index of the image (within `images`) that expands to fill the viewport
   * during the scroll transition. The array is rotated so this image always
   * renders at the visual center of the strip.
   */
  pinImageIndex: number
}

/**
 * Horizontal image strip that drifts into view as the user scrolls down.
 * The image at `pinImageIndex` is placed at the center of the strip and
 * later cloned by `useCinemaScroll` to drive the full-viewport expand animation.
 *
 * Must be rendered inside `<CinemaScroll>`.
 *
 * @throws if `images.length < 13`
 * @throws if `images.length` is even
 * @throws if `pinImageIndex` is out of bounds
 */
export function CinemaScrollMarquee({ images, pinImageIndex }: CinemaScrollMarqueeProps) {
  if (images.length < 13) {
    throw new Error(
      `CinemaScroll.Marquee: images array must have at least 13 items to avoid cropping on large screens (received ${images.length}).`,
    )
  }
  if (images.length % 2 === 0) {
    throw new Error(
      `CinemaScroll.Marquee: images array must have an odd length so the pin image can sit in the exact center (received ${images.length}).`,
    )
  }
  if (pinImageIndex < 0 || pinImageIndex >= images.length) {
    throw new Error(
      `CinemaScroll.Marquee: pinImageIndex ${pinImageIndex} is out of bounds for an images array of length ${images.length}.`,
    )
  }

  const { marqueeRef, marqueeImagesRef, pinImgRef } = useCinemaScrollContext()

  // Rotate the array so the pin image always sits at the center position.
  const centerIndex = Math.floor(images.length / 2)
  const rotate = (pinImageIndex - centerIndex + images.length) % images.length
  const orderedImages = [...images.slice(rotate), ...images.slice(0, rotate)]

  // Apply the device aspect ratio before paint so images always match the
  // viewport proportions without any flash of the SSR fallback.
  useLayoutEffect(() => {
    if (!marqueeImagesRef.current) return
    marqueeImagesRef.current.style.setProperty(
      '--device-aspect',
      `${window.innerWidth} / ${window.innerHeight}`,
    )
  }, [marqueeImagesRef])

  return (
    <div ref={marqueeRef} className="relative w-full h-[50svh] overflow-hidden">
      {/* Overflow mask — wider on mobile so more images are visible */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] lg:w-[150%] h-full">
        <div
          ref={marqueeImagesRef}
          className="absolute top-1/2 left-1/2 w-[200%] h-full flex justify-between items-center gap-4 will-change-transform"
          style={toCSSVars({ "device-aspect": "16/9" })}
        >
          {orderedImages.map((img, i) => (
            <div key={i} className="flex-1 w-full aspect-(--device-aspect)">
              <Image
                ref={i === centerIndex ? (el) => { pinImgRef.current = el } : undefined}
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
