"use client"

import { cn, toCSSVars } from "@/lib/utils/helpers"
import { twoDigits } from "@/lib/utils/strings"

import { useProductSliderContext } from "./product-slider.context"
import { PROGRESS_WIDTH } from "./product-slider.utils"

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
 * <ProductSlider products={products}>
 *   <ProductSliderPagination />
 * </ProductSlider>
 * ```
 */
export function ProductSliderPagination({ className }: PaginationProps) {
  const { activeIndexRef, initialLines, products, setLineRef } = useProductSliderContext()

  return (
    <div
      className={cn("w-full h-6 flex gap-4 justify-center items-center select-none", className)}
      style={toCSSVars({ "progress-bar-width": PROGRESS_WIDTH })}
    >
      <span ref={activeIndexRef} className="flex items-center justify-center min-w-4 text-sm">
        0
      </span>
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
      <span className="flex items-center justify-center min-w-4 text-sm">
        {twoDigits(products.length)}
      </span>
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
        "absolute top-0 left-0 w-px h-4",
        "bg-primary-base origin-center",
        "translate-x-(--x) scale-y-(--scale-y) opacity-(--opacity)",
        "transition-[opacity,scale] duration-1000 ease-in-out"
      )}
      style={toCSSVars({ "x": x, "scale-y": `${scaleY}`, "opacity": `${opacity}` }, "px")}
    />
  )
}
