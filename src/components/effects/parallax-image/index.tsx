'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

import { Image, type ImageProps } from '@/components/ui/image'
import { getRandomNumber } from '@/lib/utils/numbers'

export function ParallaxImage({ src, alt, ...imageProps }: ImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const randomNumber = getRandomNumber(10, 20)

    gsap.set("img", {
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

    gsap.fromTo("img", from, to)
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="flex items-center justify-center h-full overflow-hidden">
      <div className="w-full h-full scale-110">
        <Image src={src} alt={alt} {...imageProps} fill />
      </div>
    </div>
  )
}
