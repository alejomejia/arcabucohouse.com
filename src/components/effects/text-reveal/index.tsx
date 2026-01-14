'use client'

import { cn } from '@/lib/utils/helpers'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { Children, cloneElement, useCallback, useMemo, useRef } from 'react'

// Register SplitText plugin only on client-side to prevent SSR issues
// SplitText is a premium GSAP plugin that splits text into individual characters, words, or lines
if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText)
}

/**
 * SplitText type options for different animation granularities
 * Controls how text is split for animation effects
 */
const TYPES = {
  lines: 'lines',
  words: 'words',
  chars: 'chars'
} as const

type Type = keyof typeof TYPES

/**
 * Animation easing presets for different text animation styles
 * These provide consistent, professional animation curves
 */
const EASING_PRESETS = {
  smooth: 'power4.out',
  bouncy: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  sharp: 'power2.out',
  gentle: 'power1.out'
} as const

type EasingPreset = keyof typeof EASING_PRESETS

/**
 * Animation duration presets based on text length and complexity
 * Shorter durations for better UX, longer for dramatic effect
 */
const DURATION_PRESETS = {
  fast: 0.6,
  normal: 1,
  slow: 1.4,
  dramatic: 2
} as const

type DurationPreset = keyof typeof DURATION_PRESETS

/**
 * Scroll trigger start positions for different animation timing
 * Controls when the animation starts relative to viewport
 */
const SCROLL_POSITIONS = {
  early: 'top 90%',
  normal: 'top 75%',
  late: 'top 50%',
  center: 'center center'
} as const

type ScrollPosition = keyof typeof SCROLL_POSITIONS

interface TextRevealProps {
  /** React children to animate - can be single element or multiple elements */
  children: React.ReactNode
  /** How to split the text for animation - lines, words, or characters */
  type?: Type
  /** Whether to trigger animation on scroll or immediately, default `true` */
  animateOnScroll?: boolean
  /** Delay before animation starts (in seconds), default `0` */
  delay?: number
  /** Animation duration preset or custom value */
  duration?: DurationPreset | number
  /** Animation easing preset */
  ease?: EasingPreset | string
  /** Stagger delay between animated lines (in seconds) */
  stagger?: number
  /** Scroll trigger start position */
  scrollStart?: ScrollPosition | string
  /** Whether animation should only run once */
  once?: boolean
  /** Custom CSS class for additional styling */
  className?: string
  /** Callback fired when animation completes */
  onComplete?: () => void
  /** Callback fired when animation starts */
  onStart?: () => void
}

/**
 * A high-performance, flexible text animation component using GSAP SplitText.
 *
 * Usage Examples:
 * ```tsx
 * // Basic usage (lines)
 * <TextReveal>
 *   <h1>Animated heading</h1>
 * </TextReveal>
 *
 * // Word-by-word animation
 * <TextReveal type="words" stagger={0.1}>
 *   <h1>Animated word by word</h1>
 * </TextReveal>
 *
 * // Character-by-character animation
 * <TextReveal type="chars" stagger={0.05}>
 *   <h1>Typewriter effect</h1>
 * </TextReveal>
 *
 * // Multiple elements
 * <TextReveal>
 *   <h1>Title</h1>
 *   <p>Subtitle</p>
 * </TextReveal>
 *
 * // Custom animation
 * <TextReveal
 *   type="words"
 *   duration="fast"
 *   ease="bouncy"
 *   stagger={0.2}
 *   onComplete={() => console.log('Done!')}
 * >
 *   <h1>Custom animated text</h1>
 * </TextReveal>
 * ```
 */
export function TextReveal({
  children,
  type = 'lines',
  animateOnScroll = true,
  delay = 0,
  duration = 'normal',
  ease = 'smooth',
  stagger = 0.1,
  scrollStart = 'normal',
  once = true,
  className,
  onComplete,
  onStart
}: TextRevealProps) {
  // Refs for DOM elements and GSAP instances
  // Using separate refs for better organization and cleanup
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<HTMLElement[]>([])
  const splitsRef = useRef<SplitText[]>([])
  const animatedElementsRef = useRef<HTMLElement[]>([])

  // Memoize animation configuration to prevent unnecessary recalculations
  const animationConfig = useMemo(() => {
    const durationValue = typeof duration === 'number' ? duration : DURATION_PRESETS[duration]

    const easeValue =
      typeof ease === 'string' && ease in EASING_PRESETS ? EASING_PRESETS[ease as keyof typeof EASING_PRESETS] : ease

    const scrollStartValue =
      typeof scrollStart === 'string' && scrollStart in SCROLL_POSITIONS
        ? SCROLL_POSITIONS[scrollStart as keyof typeof SCROLL_POSITIONS]
        : scrollStart

    return {
      duration: durationValue,
      ease: easeValue,
      scrollStart: scrollStartValue,
      stagger,
      delay
    }
  }, [duration, ease, scrollStart, delay, stagger, type])

  // Memoized callbacks
  const handleComplete = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  const handleStart = useCallback(() => {
    onStart?.()
  }, [onStart])

  const createAnimation = useCallback(() => {
    // Early return if container not available (SSR safety)
    if (!containerRef.current) return

    // Reset refs arrays for clean state
    // This ensures no stale references from previous renders
    splitsRef.current = []
    elementsRef.current = []
    animatedElementsRef.current = []

    let elements = []

    // Determine if we're animating multiple elements or a single element
    // The data-multiple attribute indicates multiple child elements
    if (containerRef.current.hasAttribute('data-multiple')) {
      elements = Array.from(containerRef.current.children) as HTMLElement[]
    } else {
      elements = [containerRef.current]
    }

    // Process each element for text splitting and animation setup
    elements.forEach((element: HTMLElement) => {
      elementsRef.current.push(element)

      // Create SplitText instance based on split type
      // SplitText.create is more efficient than new SplitText() constructor
      const split = SplitText.create(element, {
        type: TYPES[type] === 'chars' ? 'words, chars' : TYPES[type], // Split by lines, words, or characters
        mask: TYPES[type], // Mask elements for clean animation
        [`${type}Class`]: `${type}++`, // Add incremental CSS classes
        tag: 'span' // Wrap each element in span elements
      })

      splitsRef.current.push(split)

      // Handle text-indent preservation (only for lines)
      // Convert text-indent to padding-left on first line to maintain visual consistency
      if (type === 'lines') {
        const computedStyle = window.getComputedStyle(element)
        const textIndent = computedStyle.textIndent

        if (textIndent && textIndent !== '0px') {
          if (split.lines && split.lines.length > 0) {
            // Apply text-indent as padding to first line
            ;(split.lines[0] as HTMLElement).style.setProperty('paddingLeft', textIndent)
          }

          // Remove text-indent from parent to prevent double indentation
          element.style.setProperty('textIndent', '0')
        }
      }

      // Collect animated elements based on split type
      const animatedElements =
        type === 'lines'
          ? (split.lines as HTMLElement[])
          : type === 'words'
            ? (split.words as HTMLElement[])
            : (split.chars as HTMLElement[])

      animatedElementsRef.current.push(...animatedElements)
    })

    // Set initial state - lines start below their final position
    // This creates the "reveal from bottom" effect
    gsap.set(animatedElementsRef.current, { y: '100%' })

    // Build animation properties object
    const animationProps = {
      y: '0%', // Animate to final position
      duration: animationConfig.duration,
      stagger: animationConfig.stagger,
      ease: animationConfig.ease,
      delay: animationConfig.delay,
      onComplete: handleComplete,
      onStart: handleStart
    }

    // Apply animation based on scroll trigger preference
    if (animateOnScroll) {
      gsap.to(animatedElementsRef.current, {
        ...animationProps,
        scrollTrigger: {
          trigger: containerRef.current,
          start: animationConfig.scrollStart,
          once, // Whether to run animation only once
          // Additional ScrollTrigger options for better performance
          invalidateOnRefresh: true,
          refreshPriority: -1
        }
      })
    } else {
      // Immediate animation without scroll trigger
      gsap.to(animatedElementsRef.current, animationProps)
    }

    // Cleanup function - critical for preventing memory leaks
    // SplitText instances must be properly reverted to restore original DOM state
    return () => {
      splitsRef.current.forEach((split) => {
        if (split) {
          split.revert() // Restores original text and removes split elements
        }
      })

      // Clear refs to prevent memory leaks
      splitsRef.current = []
      elementsRef.current = []
      animatedElementsRef.current = []
    }
  }, [animateOnScroll, animationConfig, handleComplete, handleStart, once, type])

  useGSAP(createAnimation, {
    scope: containerRef
  })

  // Render logic for single vs multiple children
  // Single child: clone element and attach ref directly
  // Multiple children: wrap in container div with data-multiple attribute

  if (Children.count(children) === 1) {
    const child = children as React.ReactElement<{ className?: string }>

    return cloneElement(child, {
      ref: containerRef,
      className: cn(child?.props?.className, 'all-children-span:inline-block', className)
    } as any)
  }

  return (
    <div ref={containerRef} data-multiple="true" className={cn('all-children-span:inline-block', className)}>
      {children}
    </div>
  )
}
