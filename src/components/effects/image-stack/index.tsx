"use client"

import { forwardRef, useImperativeHandle } from "react"

import { Image } from "@/components/ui/image"
import { cn } from "@/lib/utils/helpers"
import { useImageStackReveal, type ImageStackRevealConfig } from "./use-image-stack-reveal"

/**
 * Image data for the stack
 */
export interface StackImage {
  id: string
  src: string
  alt: string
}

/**
 * Props for the ImageStack component
 */
export interface ImageStackProps {
  /** Array of images to render in the stack */
  images: StackImage[]
  /** Animation configuration */
  animationConfig?: ImageStackRevealConfig
  /** Initial animation configuration */
  initAnimationConfig?: gsap.TweenVars
  /** Additional class name for the container */
  className?: string
}

/**
 * Ref handle exposed by ImageStack
 */
export interface ImageStackRef {
  /** Animate to a specific image index (debounced) */
  animateToIndex: (index: number) => void
  /** Animate to a specific image index (immediate) */
  animateToIndexImmediate: (index: number) => void
  /** Cancel any pending animation */
  cancelPendingAnimation: () => void
  /** Initialize the stack (call in useGSAP) */
  initializeStack: () => void
  /** Get current visible index */
  getCurrentIndex: () => number
}

/**
 * A component that renders a stack of pre-loaded images with smooth reveal animations.
 * Uses clip-path and scale animations powered by GSAP for buttery smooth transitions.
 * 
 * @example
 * ```tsx
 * const stackRef = useRef<ImageStackRef>(null)
 * 
 * const images = [
 *   { id: "default", src: "/default.jpg", alt: "Default" },
 *   { id: "item-1", src: "/img1.jpg", alt: "Image 1" },
 * ]
 * 
 * useGSAP(() => {
 *   stackRef.current?.initializeStack()
 * }, { scope: containerRef })
 * 
 * // On hover
 * stackRef.current?.animateToIndex(1)
 * ```
 */
export const ImageStack = forwardRef<ImageStackRef, ImageStackProps>(
  function ImageStack({ images, animationConfig, initAnimationConfig, className }, ref) {
    const {
      wrapperRefs,
      imageRefs,
      currentIndex,
      initializeStack,
      animateToIndex,
      animateToIndexImmediate,
      cancelPendingAnimation
    } = useImageStackReveal({ imageCount: images.length, config: animationConfig, initConfig: initAnimationConfig })

    // Expose imperative methods via ref
    useImperativeHandle(ref, () => ({
      animateToIndex,
      animateToIndexImmediate,
      cancelPendingAnimation,
      initializeStack,
      getCurrentIndex: () => currentIndex.current
    }), [animateToIndex, animateToIndexImmediate, cancelPendingAnimation, initializeStack, currentIndex])

    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        {images.map((img, index) => (
          <div
            key={img.id}
            ref={(el) => { wrapperRefs.current[index] = el }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            <Image
              ref={(el) => { imageRefs.current[index] = el }}
              className="w-full h-full object-cover will-change-transform"
              src={img.src}
              alt={img.alt}
              fill
            />
          </div>
        ))}
      </div>
    )
  }
)
