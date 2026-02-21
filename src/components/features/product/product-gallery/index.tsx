"use client"

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTransitionState } from 'next-transition-router';
import { useRef } from 'react';

import { Image } from '@/components/ui/image';

type ProductGalleryProps = {
  images: { src: string; altText: string }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { stage } = useTransitionState()

  useGSAP(() => {
    if (!containerRef.current || stage !== "none") return

    gsap.set(containerRef.current, { opacity: 1, y: "100vh" })

    gsap.to(containerRef.current, {
      y: 0,
      duration: 2,
      ease: "power3.inOut",
    })
  }, {
    scope: containerRef,
    dependencies: [stage]
  })

  return (
    <div ref={containerRef} className="flex flex-col gap-8 opacity-0">
      {images.map((image) => (
        <div key={image.src} className="brand-gradient-primary" data-product-gallery-image>
          <Image
            src={image.src}
            alt={image.altText}
          />
        </div>
      ))}
    </div>
  )
}
