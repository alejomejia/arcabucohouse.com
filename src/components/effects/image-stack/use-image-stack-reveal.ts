"use client"

import gsap from "gsap"
import { useCallback, useEffect, useRef, type RefObject } from "react"

/**
 * Configuration options for the image stack reveal animation
 */
export interface ImageStackRevealConfig {
  /** Debounce delay in milliseconds for rapid transitions */
  debounceDelay?: number
  /** Duration of the clip-path reveal animation */
  revealDuration?: number
  /** Duration of the scale animation */
  scaleDuration?: number
  /** GSAP easing function */
  ease?: string
  /** Initial scale of hidden images */
  initialScale?: number
}

/**
 * Return type for the useImageStackReveal hook
 */
export interface UseImageStackRevealReturn {
  /** Refs array for image wrapper elements */
  wrapperRefs: RefObject<(HTMLDivElement | null)[]>
  /** Refs array for image elements */
  imageRefs: RefObject<(HTMLImageElement | null)[]>
  /** Current visible image index */
  currentIndex: RefObject<number>
  /** Initialize the stack with first image visible */
  initializeStack: () => void
  /** Animate to a specific image index with debouncing */
  animateToIndex: (targetIndex: number) => void
  /** Immediately animate to index without debouncing */
  animateToIndexImmediate: (targetIndex: number) => void
  /** Cancel any pending debounced animation */
  cancelPendingAnimation: () => void
}

const DEFAULT_CONFIG: Required<ImageStackRevealConfig> = {
  debounceDelay: 500,
  revealDuration: 0.7,
  scaleDuration: 0.9,
  ease: "power3.out",
  initialScale: 1.3
}

type UseImageStackReveal = {
  imageCount: number
  config?: ImageStackRevealConfig
  initConfig?: gsap.TweenVars
}

/**
 * Hook for managing animated image stack reveals with GSAP.
 * Provides smooth clip-path and scale animations for transitioning between stacked images.
 *
 * @param imageCount - Total number of images in the stack
 * @param config - Animation configuration options
 * @returns Animation controls and refs for the image stack
 *
 * **Performance trade-off**: the reveal animates `clip-path`, which forces
 * a repaint per frame on the affected layer. That's acceptable for short
 * reveals (`revealDuration` ≤ 1s) at the typical card size — for long or
 * full-bleed reveals consider `mask-image` plus a `transform` on a
 * sibling, which can stay on the compositor.
 *
 * @example
 * ```tsx
 * const { wrapperRefs, imageRefs, initializeStack, animateToIndex } = useImageStackReveal({ imageCount: 5 })
 *
 * useGSAP(() => {
 *   initializeStack()
 * }, { scope: containerRef })
 *
 * // On hover
 * animateToIndex(2)
 * ```
 */
export function useImageStackReveal({
  imageCount,
  config,
  initConfig
}: UseImageStackReveal): UseImageStackRevealReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  // Refs for DOM elements
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])

  // Animation state
  const currentIndex = useRef(0)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Animate in the first image when component mounts
   */
  const animateIn = useCallback(() => {
    const firstWrapper = wrapperRefs.current[0]
    const firstImage = imageRefs.current[0]
    
    if (!firstWrapper || !firstImage) return
    
    // Kill any existing tweens
    gsap.killTweensOf([firstWrapper, firstImage])

    // Set initial state
    gsap.set(firstWrapper, {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      zIndex: 10
    })
    
    gsap.set(firstImage, { scale: mergedConfig.initialScale })

    // Animate in
    gsap.to(firstWrapper, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: mergedConfig.revealDuration,
      ease: mergedConfig.ease,
      ...initConfig
    })

    gsap.to(firstImage, {
      scale: 1,
      duration: mergedConfig.scaleDuration,
      ease: mergedConfig.ease,
      ...initConfig
    })
  }, [])

  /**
   * Initialize the image stack with first image visible, rest hidden
   */
  const initializeStack = useCallback(() => {
    wrapperRefs.current.forEach((wrapper, index) => {
      if (!wrapper) return
      gsap.set(wrapper, {
        clipPath: index === 0
          ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
          : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        zIndex: index === 0 ? 1 : 0
      })
    })

    imageRefs.current.forEach((image, index) => {
      if (!image) return
      gsap.set(image, { scale: index === 0 ? 1 : mergedConfig.initialScale })
    })

    // Animate in the first image
    animateIn()
  }, [mergedConfig.initialScale])

  /**
   * Core animation function - pure GSAP, no React state
   */
  const animateToIndexImmediate = useCallback((targetIndex: number) => {
    const prevIndex = currentIndex.current

    // Skip if already showing this image or invalid index
    if (targetIndex === prevIndex) return
    if (targetIndex < 0 || targetIndex >= imageCount) return

    const targetWrapper = wrapperRefs.current[targetIndex]
    const targetImage = imageRefs.current[targetIndex]
    const currentWrapper = wrapperRefs.current[prevIndex]

    if (!targetWrapper || !targetImage) return

    // Kill any running animation
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Prepare target: reset and bring to front
    gsap.set(targetWrapper, {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      zIndex: 10
    })
    gsap.set(targetImage, { scale: mergedConfig.initialScale })

    // Keep current image visible underneath during transition
    if (currentWrapper) {
      gsap.set(currentWrapper, { zIndex: 5 })
    }

    // Update tracking
    currentIndex.current = targetIndex

    // Create animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Reset all other images to base state
        wrapperRefs.current.forEach((wrapper, index) => {
          if (!wrapper || index === targetIndex) return
          gsap.set(wrapper, {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            zIndex: 0
          })
        })
        imageRefs.current.forEach((image, index) => {
          if (!image || index === targetIndex) return
          gsap.set(image, { scale: mergedConfig.initialScale })
        })

        // Ensure target stays visible
        gsap.set(targetWrapper, { zIndex: 1 })
      }
    })
    timelineRef.current = tl

    // Animate target in
    tl.to(targetWrapper, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: mergedConfig.revealDuration,
      ease: mergedConfig.ease
    }, 0)

    tl.to(targetImage, {
      scale: 1,
      duration: mergedConfig.scaleDuration,
      ease: mergedConfig.ease
    }, 0)

  }, [imageCount, mergedConfig.initialScale, mergedConfig.revealDuration, mergedConfig.scaleDuration, mergedConfig.ease])

  /**
   * Debounced animation - use for hover interactions
   */
  const animateToIndex = useCallback((targetIndex: number) => {
    // Validate
    if (targetIndex < 0 || targetIndex >= imageCount) return

    // Skip if already at this index
    if (targetIndex === currentIndex.current) {
      // Clear existing debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      return
    }

    // Clear existing debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce rapid transitions
    debounceTimerRef.current = setTimeout(() => {
      animateToIndexImmediate(targetIndex)
    }, mergedConfig.debounceDelay)

  }, [imageCount, mergedConfig.debounceDelay, animateToIndexImmediate])

  /**
   * Cancel any pending debounced animation
   */
  const cancelPendingAnimation = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
    }
  }, [])

  return {
    wrapperRefs,
    imageRefs,
    currentIndex,
    initializeStack,
    animateToIndex,
    animateToIndexImmediate,
    cancelPendingAnimation
  }
}
