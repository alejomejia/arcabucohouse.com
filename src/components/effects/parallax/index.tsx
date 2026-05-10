'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type ReactNode, useRef, type VideoHTMLAttributes } from 'react'

import { Image, type ImageProps } from '@/components/ui/image'
import { Video } from '@/components/ui/video'
import { getRandomNumber } from '@/lib/utils/numbers'

type ParallaxProps = {
  children: ReactNode
}

export function Parallax({ children }: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !contentRef.current) return

    const randomNumber = getRandomNumber(10, 20)

    gsap.set(contentRef.current, {
      yPercent: -10
    })

    const from = { yPercent: -10 }

    const to = {
      yPercent: randomNumber,
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
      <div ref={contentRef} className="w-full h-full scale-110">
        {children}
      </div>
    </div>
  )
}

export function ParallaxImage({ src, alt, ...imageProps }: ImageProps) {
  return (
    <Parallax>
      <Image src={src} alt={alt} {...imageProps} fill />
    </Parallax>
  )
}

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
