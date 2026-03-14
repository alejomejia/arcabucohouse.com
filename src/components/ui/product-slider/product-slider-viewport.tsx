"use client"

import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react"

import { CURSOR_DRAG, CURSOR_MEDIUM } from "@/components/effects/cursor/cursor-states"
import { CursorTrigger } from "@/components/effects/cursor/cursor-trigger"
import { cn } from "@/lib/utils/helpers"
import { useProductSliderContext } from "./product-slider.context"

type ViewportProps = {
  className?: string
  children: ReactNode
}

type SlideProps = {
  _indexOffset?: number
  [key: string]: unknown
}

/**
 * Scrollable viewport for the `ProductSlider` compound component.
 *
 * Client Component — renders slides twice (original + clone) for seamless infinite looping.
 * Attaches drag and wheel event handlers from context.
 *
 * @param children - `ProductSliderSlide` elements to display.
 *
 * @example
 * ```tsx
 * <ProductSlider products={products}>
 *   <ProductSliderViewport>
 *     {products.map((p, i) => (
 *       <ProductSliderSlide key={p.handle} index={i} imageSrc={p.images[0]?.url} />
 *     ))}
 *   </ProductSliderViewport>
 * </ProductSlider>
 * ```
 */
export function ProductSliderViewport({ className, children }: ViewportProps) {
  const {
    sliderRef,
    containerRef,
    isGrabbing,
    showCursorDrag,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onLostPointerCapture,
    onClickCapture,
    debug,
  } = useProductSliderContext()

  const childArray = Children.toArray(children)
  const count = childArray.length

  return (
    <CursorTrigger config={showCursorDrag ? CURSOR_DRAG : CURSOR_MEDIUM}>
      <div
        className={cn("relative w-full overflow-hidden", className)}
        ref={sliderRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onLostPointerCapture={onLostPointerCapture}
        onClickCapture={onClickCapture}
      >
        {debug && (
          <div className={cn(
            "fixed top-0 left-1/2 z-1000",
            "w-px h-screen",
            "bg-red-500 pointer-events-none")}
          />
        )}
        <div
          className={cn(
            "cursor-grab flex gap-2 h-full w-fit will-change-transform",
            {
              "cursor-grabbing": isGrabbing
            }
          )}
          ref={containerRef}
        >
          {/* First set */}
          {childArray}
          {/* Second set (duplicate for infinite loop) */}
          {childArray.map((child) => {
            if (!isValidElement<SlideProps>(child)) return child
            return cloneElement(child, {
              key: `dup-${(child as ReactElement).key}`,
              _indexOffset: count,
            })
          })}
        </div>
      </div>
    </CursorTrigger>
  )
}
