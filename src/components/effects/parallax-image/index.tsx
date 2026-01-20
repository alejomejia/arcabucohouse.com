'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

import { Image, type ImageProps } from '@/components/ui/image'

export function ParallaxImage({ src, alt, ...imageProps }: ImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const from = { yPercent: -20 }
    const to = {
      yPercent: 20,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }

    gsap.fromTo("img", from, to)
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="flex items-center justify-center overflow-hidden">
      <div className="w-full scale-120">
        <Image src={src} alt={alt} {...imageProps} />
      </div>
    </div>
  )
}
