'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCallback, useRef } from 'react'

import { Image, type ImageProps } from '@/components/ui/image'
import { cn } from '@/lib/utils/helpers'

interface StackedImageRevealProps {
  images: ImageProps[]
  priority?: boolean
  className?: string
  delay?: number
  once?: boolean
  scrollStart?: string
  animateOnScroll?: boolean
  onStart?: () => void
  onComplete?: () => void
}

/**
 * Stack of fill-images that reveal one after the other via clip-path,
 * each layer also scaling down from `scale-200` to `1` for a subtle
 * push-back effect. Optionally driven by `ScrollTrigger`.
 *
 * The GSAP timeline is created inside `useGSAP`'s scoped context, so
 * its tweens (and any `ScrollTrigger`) are killed on unmount; the
 * timeline itself is returned from the callback to make cleanup explicit.
 *
 * @example
 * ```tsx
 * <StackedImageReveal
 *   images={[{ src: '/a.jpg', alt: '' }, { src: '/b.jpg', alt: '' }]}
 *   scrollStart="top 70%"
 * />
 * ```
 */
export function StackedImageReveal({
  images,
  priority = false,
  className,
  delay = 0,
  once = true,
  scrollStart = 'top 50%',
  animateOnScroll = true,
  onStart,
  onComplete
}: StackedImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRefs = useRef<HTMLDivElement[]>([])
  const imageRefs = useRef<HTMLImageElement[]>([])

  // Animation function with error handling
  const createAnimation = useCallback(() => {
    if (!containerRef.current || images.length === 0) return

    const tl = gsap.timeline({
      delay,
      onStart: onStart,
      onComplete: onComplete,
      ...(animateOnScroll && {
        scrollTrigger: {
          trigger: containerRef.current,
          start: scrollStart,
          once,
          invalidateOnRefresh: true,
          refreshPriority: -1
        }
      })
    })

    // Animate wrapper containers
    wrapperRefs.current.forEach((wrapper, index) => {
      if (!wrapper) return

      tl.to(
        wrapper,
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1,
          ease: 'hop',
          delay: index * 0.75
        },
        'start' // Start all wrapper animations at the same time
      )
    })

    // Animate inner images
    imageRefs.current.forEach((image, index) => {
      if (!image) return

      tl.to(
        image,
        {
          scale: 1,
          duration: 1.5,
          ease: 'hop',
          delay: index * 0.75
        },
        `start-=0.25`
      )
    })

    return tl
  }, [images.length, delay, onStart, onComplete])

  useGSAP(createAnimation, { scope: containerRef })

  // Early return for empty images array
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div ref={containerRef} className={cn('arc-images-animation relative w-full h-full overflow-hidden', className)}>
      {images.map((img, index) => {
        return (
          <div
            key={index}
            ref={(el) => {
              if (el) wrapperRefs.current[index] = el
            }}
            className="arc-images-animation__wrapper absolute w-full h-full overflow-hidden"
          >
            <Image
              ref={(el) => {
                if (el) imageRefs.current[index] = el
              }}
              className="relative w-full h-full scale-200 will-change-transform"
              fill
              priority={priority}
              {...img}
            />
          </div>
        )
      })}
    </div>
  )
}
