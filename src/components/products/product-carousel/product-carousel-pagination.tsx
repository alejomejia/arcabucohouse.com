"use client"

import { cn, toCSSVars } from "@/lib/utils/helpers"
import { twoDigits } from "@/lib/utils/strings"

import { Text } from "@/components/ui/text"
import { useProductCarouselContext } from "./product-carousel.context"
import { PROGRESS_WIDTH } from "./product-carousel.utils"

type PaginationProps = {
  className?: string
}

type PaginationLineProps = {
  x: number
  scaleY: number
  opacity: number
  lineRef: (el: HTMLDivElement | null) => void
}

/**
 * Renders the pagination bar: active index, animated progress lines, and total count.
 *
 * Client Component — index text and line transforms update imperatively via refs
 * on every frame (no re-renders during scroll).
 *
 * @example
 * ```tsx
 * <ProductCarousel products={products}>
 *   <ProductCarouselPagination />
 * </ProductCarousel>
 * ```
 */
export function ProductCarouselPagination({ className }: PaginationProps) {
  const { activeIndexRef, initialLines, products, setLineRef } = useProductCarouselContext()

  return (
    <div
      className={cn("w-full h-6 flex gap-4 justify-center items-center select-none", className)}
      style={toCSSVars({ "progress-bar-width": PROGRESS_WIDTH })}
    >
      <Text ref={activeIndexRef} preset="small" className="flex items-center justify-center min-w-4">
        0
      </Text>
      <div className="relative flex justify-center w-(--progress-bar-width) h-full">
        <div className="relative w-full h-full">
          {initialLines.map((line, i) => (
            <PaginationLine
              key={i}
              x={line.x}
              scaleY={line.scaleY}
              opacity={line.opacity}
              lineRef={setLineRef(i)}
            />
          ))}
        </div>
      </div>
      <Text preset="small" className="flex items-center justify-center min-w-4">
        {twoDigits(products.length)}
      </Text>
    </div>
  )
}

/**
 * Single vertical progress line in the pagination bar.
 *
 * Initial transform set via CSS vars; subsequent updates applied imperatively
 * through `lineRef` — no re-renders required.
 */
function PaginationLine({ x, scaleY, opacity, lineRef }: PaginationLineProps) {
  return (
    <div
      ref={lineRef}
      className={cn(
        "absolute top-1 left-0 w-px h-4",
        "bg-zinc-500 origin-center",
        "translate-x-(--x) scale-y-(--scale-y) opacity-(--opacity)",
        "transition-[opacity,scale] duration-1000 ease-in-out"
      )}
      style={toCSSVars({ "x": x, "scale-y": scaleY, "opacity": opacity }, "px")}
    />
  )
}
