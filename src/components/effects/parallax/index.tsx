'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type ReactNode, useRef, type VideoHTMLAttributes } from 'react'

import { Image, type ImageProps } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

type ParallaxProps = {
  children: ReactNode
}

/**
 * Wraps `children` in a clipped container that translates vertically as
 * the user scrolls past it (`-5%` → `10%`).
 *
 * The inner content is scaled `1.25×` so the parallax shift never exposes
 * a transparent gap at the top or bottom of the container.
 *
 * @example
 * ```tsx
 * <Parallax>
 *   <div className="bg-[url(/hero.jpg)] bg-cover w-full h-full" />
 * </Parallax>
 * ```
 */
export function Parallax({ children }: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !contentRef.current) return

    gsap.set(contentRef.current, {
      yPercent: -5
    })

    const from = { yPercent: -5 }

    const to = {
      yPercent: 10,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }

    gsap.fromTo(contentRef.current, from, to)
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <div ref={contentRef} className="w-full h-full scale-125">
        {children}
      </div>
    </div>
  )
}

/**
 * `Parallax` wrapper around an `Image` rendered with `fill`.
 *
 * @example
 * ```tsx
 * <div className="aspect-video">
 *   <ParallaxImage src="/banner.jpg" alt="" />
 * </div>
 * ```
 */
export function ParallaxImage({ src, alt, ...imageProps }: ImageProps) {
  return (
    <Parallax>
      <Image src={src} alt={alt} {...imageProps} fill />
    </Parallax>
  )
}

/**
 * `Parallax` wrapper around a `Video` configured for autoplay-friendly
 * defaults (`muted`, `playsInline`, no controls, viewport `threshold=0`).
 *
 * @example
 * ```tsx
 * <div className="aspect-video">
 *   <ParallaxVideo src="/hero.mp4" loop />
 * </div>
 * ```
 */
export function ParallaxVideo({ className, ...props }: VideoHTMLAttributes<HTMLVideoElement>) {
  return (
    <Parallax>
      <Video
        className={className}
        playsInline
        muted
        controls={false}
        threshold={0}
        {...props}
      />
    </Parallax>
  )
}
