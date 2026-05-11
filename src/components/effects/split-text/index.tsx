"use client"

import { useGSAP } from "@gsap/react"
import { SplitText as GSAPSplitText } from "gsap/SplitText"
import {
  Children,
  cloneElement,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type ReactElement,
  type ReactNode
} from "react"

import { cn } from "@/lib/utils/helpers"

/**
 * Split type options for text splitting
 */
const splitTypes = ["chars", "words", "lines"] as const
export type SplitType = (typeof splitTypes)[number]

/**
 * Maximum time (ms) we wait for `document.fonts.ready` before giving up
 * and splitting anyway. A stuck font load (e.g. flaky CDN, browser bug)
 * must not block the text from ever appearing.
 */
const FONT_READY_TIMEOUT_MS = 2000

export interface SplitTextProps {
  /** Content to split - can be single element or multiple elements */
  children: ReactNode
  /** How to split the text: chars, words, or lines */
  type?: SplitType
  /** CSS class name for the split elements (chars, words, or lines) */
  splitClassName?: string
  /** Additional class name for the container */
  className?: string
  /** Whether to wait for fonts to load before splitting */
  waitForFonts?: boolean
  /**
   * Called once when fonts are loaded and text is split.
   *
   * Any GSAP animations created inside this callback are automatically
   * tracked by SplitText's internal context and cleaned up on unmount.
   * This eliminates the need for async/await or polling in consumer components.
   *
   * @param elements - The split elements (chars, words, or lines)
   * @param containers - The container element(s) that were split
   *
   * @example
   * ```tsx
   * <SplitText
   *   type="words"
   *   onReady={(words) => {
   *     gsap.set(words, { yPercent: 100 })
   *     gsap.to(words, { yPercent: 0, stagger: 0.03 })
   *   }}
   * >
   *   <p>Hello World</p>
   * </SplitText>
   * ```
   */
  onReady?: (elements: HTMLElement[], containers: HTMLElement[]) => void
}

/**
 * Ref handle exposed by SplitText component
 */
export interface SplitTextRef {
  /** Get all split elements (chars, words, or lines) from all children */
  getElements: () => HTMLElement[]
  /** Get the GSAP SplitText instances for all children */
  getSplitInstances: () => GSAPSplitText[]
  /** Get split elements for a specific child by index */
  getElementsByIndex: (index: number) => HTMLElement[]
  /** Get SplitText instance for a specific child by index */
  getSplitInstanceByIndex: (index: number) => GSAPSplitText | null
  /** Get the container element(s) that were split */
  getContainers: () => HTMLElement[]
}

/**
 * Splits text into characters, words, or lines using GSAP SplitText.
 *
 * Waits for fonts to load (when `waitForFonts` is enabled) before splitting
 * to ensure accurate measurements. The wait races against a
 * `FONT_READY_TIMEOUT_MS` fallback so a stuck `document.fonts.ready`
 * promise can never prevent the split from running.
 *
 * Fires the `onReady` callback when done, with any GSAP animations
 * created inside automatically tracked for cleanup.
 *
 * @example
 * ```tsx
 * // Animate on ready — no ref, no hooks, no async needed
 * <SplitText
 *   type="chars"
 *   onReady={(chars) => {
 *     gsap.from(chars, { y: 100, stagger: 0.05 })
 *   }}
 * >
 *   <h1>Hello World</h1>
 * </SplitText>
 *
 * // With ref — for reactive animations driven by state
 * const splitRef = useRef<SplitTextRef>(null)
 *
 * <SplitText ref={splitRef} type="words" onReady={() => { ... }}>
 *   <h1>Title</h1>
 * </SplitText>
 * ```
 */
export const SplitText = forwardRef<SplitTextRef, SplitTextProps>(
  function SplitText(
    {
      children,
      type = "lines",
      splitClassName,
      className,
      waitForFonts = true,
      onReady
    },
    ref
  ) {
    const defaultSplitClassName = cn({
      "word:inline-block": type === "words",
      "line:inline-block": type === "lines",
      "char:inline-block": type === "chars",
    })

    const containerRef = useRef<HTMLDivElement>(null)
    const splitsRef = useRef<GSAPSplitText[]>([])
    const containersRef = useRef<HTMLElement[]>([])

    // Store latest onReady in a ref so font-loading callback uses current value
    const onReadyRef = useRef(onReady)
    onReadyRef.current = onReady

    /**
     * Get the animated elements based on split type for a specific SplitText instance
     */
    const getElementsFromSplit = useCallback(
      (split: GSAPSplitText): HTMLElement[] => {
        switch (type) {
          case "chars":
            return (split.chars as HTMLElement[]) || []
          case "words":
            return (split.words as HTMLElement[]) || []
          case "lines":
            return (split.lines as HTMLElement[]) || []
          default:
            return []
        }
      },
      [type]
    )

    /**
     * Get all split elements from all children
     */
    const getElements = useCallback((): HTMLElement[] => {
      const allElements: HTMLElement[] = []
      splitsRef.current.forEach((split) => {
        allElements.push(...getElementsFromSplit(split))
      })
      return allElements
    }, [getElementsFromSplit])

    /**
     * Get split elements for a specific child by index
     */
    const getElementsByIndex = useCallback(
      (index: number): HTMLElement[] => {
        const split = splitsRef.current[index]
        if (!split) return []
        return getElementsFromSplit(split)
      },
      [getElementsFromSplit]
    )

    /**
     * Get SplitText instance for a specific child by index
     */
    const getSplitInstanceByIndex = useCallback(
      (index: number): GSAPSplitText | null => {
        return splitsRef.current[index] || null
      },
      []
    )

    /**
     * Get the container element(s) that were split
     */
    const getContainers = useCallback((): HTMLElement[] => {
      return containersRef.current
    }, [])

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        getElements,
        getSplitInstances: () => splitsRef.current,
        getElementsByIndex,
        getSplitInstanceByIndex,
        getContainers,
      }),
      [getElements, getElementsByIndex, getSplitInstanceByIndex, getContainers]
    )

    // Initialize split text
    useGSAP((ctx) => {
      if (!containerRef.current) return

      let cancelled = false

      const initializeSplit = () => {
        if (cancelled || !containerRef.current) return

        // Determine which elements to split
        const elementsToSplit: HTMLElement[] = []

        if (Children.count(children) === 1) {
          // Single child - split the container itself
          elementsToSplit.push(containerRef.current)
        } else {
          // Multiple children - split each child
          const childrenArray = Array.from(
            containerRef.current.children
          ) as HTMLElement[]
          elementsToSplit.push(...childrenArray)
        }

        // Store container elements
        containersRef.current = [...elementsToSplit]

        // Create SplitText instances for each element
        elementsToSplit.forEach((element) => {
          // Determine class name for split elements
          const classKey = `${type}Class`

          // Remove the "s" from the type
          const defaultClassName = type.slice(0, -1)

          // Create SplitText instance
          const split = new GSAPSplitText(element, {
            type: type,
            [classKey]: splitClassName || defaultClassName,
            mask: type,
            tag: "span"
          })

          splitsRef.current.push(split)
        })

        // Notify consumer — context.add() ensures any GSAP animations
        // created inside the callback are tracked for automatic cleanup
        if (onReadyRef.current) {
          ctx.add(() => {
            onReadyRef.current?.(getElements(), getContainers())
          })
        }
      }

      // Wait for fonts to load before splitting (if enabled). Race the
      // promise against a timeout fallback so we never hang if the
      // browser's font loading promise stalls.
      if (waitForFonts && document.fonts && document.fonts.ready) {
        Promise.race([
          document.fonts.ready,
          new Promise<void>((resolve) => setTimeout(resolve, FONT_READY_TIMEOUT_MS)),
        ]).then(initializeSplit)
      } else {
        // Fallback for browsers without Font Loading API or if waitForFonts is false
        initializeSplit()
      }

      // Cleanup: SplitText instances must be manually reverted
      // as gsap.context().revert() doesn't automatically handle them
      return () => {
        cancelled = true
        splitsRef.current.forEach((split) => split?.revert())
        splitsRef.current = []
        containersRef.current = []
      }
    }, {
      scope: containerRef,
      dependencies: [type, splitClassName, waitForFonts],
      revertOnUpdate: true
    })

    // Handle single vs multiple children
    if (Children.count(children) === 1) {
      const child = children as ReactElement<{ className?: string }>

      return cloneElement(child, {
        ref: containerRef,
        className: cn(defaultSplitClassName, child?.props?.className, className)
      } as any)
    }

    return (
      <div ref={containerRef} className={cn(defaultSplitClassName, className)}>
        {children}
      </div>
    )
  }
)
