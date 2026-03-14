"use client"

import Link from "next/link"
import { useCallback } from "react"

import { cn } from "@/lib/utils/helpers"

import { useProductSliderContext } from "./product-slider.context"

type SlideProps = {
  index: number
  href?: string
  imageSrc?: string
  imageAlt?: string
  className?: string
  /** @internal Injected by `ProductSliderViewport` for the duplicate slide set. */
  _indexOffset?: number
}

/**
 * Single slide within `ProductSliderViewport`.
 *
 * Client Component — registers itself in `itemRefs` for per-slide parallax (`--p`) updates.
 * Image fades in from transparent once loaded.
 *
 * @param index - Zero-based position in the original product list.
 * @param imageSrc - Product image URL. Slide renders empty when omitted.
 *
 * @example
 * ```tsx
 * <ProductSliderViewport>
 *   {products.map((p, i) => (
 *     <ProductSliderSlide
 *       key={p.handle}
 *       index={i}
 *       href={`/product/${p.handle}`}
 *       imageSrc={p.images[0]?.url}
 *       imageAlt={p.title}
 *     />
 *   ))}
 * </ProductSliderViewport>
 * ```
 */
export function ProductSliderSlide({
  index,
  href,
  imageSrc,
  imageAlt,
  className,
  _indexOffset = 0,
}: SlideProps) {
  const { setItemRef } = useProductSliderContext()

  const imgRef = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete) el.dataset.loaded = "true"
  }, [])

  const image = imageSrc && (
    <picture className="block relative pointer-events-none select-none">
      <img
        ref={imgRef}
        className="block w-full h-full object-cover opacity-0 transition-opacity duration-1000 ease-[cubic-bezier(0.35,0.17,0.25,1)] will-change-[opacity] data-loaded:opacity-100 brand-gradient-primary"
        src={imageSrc}
        alt={imageAlt ?? ""}
        draggable={false}
        onLoad={(e) => (e.currentTarget.dataset.loaded = "true")}
      />
    </picture>
  )

  return (
    <div
      className={cn("w-110 aspect-4/3 shrink-0", className)}
      ref={setItemRef(index + _indexOffset)}
      style={{ "--p": "1" } as React.CSSProperties}
    >
      {href ? (
        <Link href={href} className="block overflow-hidden" draggable={false}>
          {image}
        </Link>
      ) : (
        <div className="overflow-hidden">
          {image}
        </div>
      )}
    </div>
  )
}
