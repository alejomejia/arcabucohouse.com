"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
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

// Register plugin client-side only
if (typeof window !== "undefined") {
  gsap.registerPlugin(GSAPSplitText)
}

/**
 * Split type options for text splitting
 */
const splitTypes = ["chars", "words", "lines"] as const
export type SplitType = (typeof splitTypes)[number]

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
  /**
   * Returns a Promise that resolves when the split is ready.
   * If already ready, resolves immediately.
   *
   * @example
   * ```tsx
   * await splitRef.current?.ready()
   * // Now safe to animate split elements
   * gsap.from(splitRef.current.getElements(), { y: 100 })
   * ```
   */
  ready: () => Promise<void>
  /**
   * @deprecated Use `ready()` instead for Promise-based readiness.
   * Check if fonts are loaded and split is ready (synchronous).
   */
  isReady: () => boolean
}

/**
 * SplitText component that splits text into characters, words, or lines using GSAP SplitText.
 * This component only handles splitting - animations should be applied externally using the exposed refs.
 *
 * @example
 * ```tsx
 * // Basic usage - single element
 * const splitRef = useRef<SplitTextRef>(null)
 *
 * <SplitText ref={splitRef} type="chars">
 *   <h1>Hello World</h1>
 * </SplitText>
 *
 * // Later, animate the split elements
 * useGSAP(() => {
 *   if (!splitRef.current) return
 * 
 *   const elements = splitRef.current.getElements()
 *   gsap.fromTo(elements, { y: 100 }, { y: 0, stagger: 0.05 })
 * }, { scope: splitRef })
 *
 * // Multiple elements
 * <SplitText ref={splitRef} type="words">
 *   <h1>Title</h1>
 *   <p>Subtitle</p>
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
      waitForFonts = true
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

    // Promise-based readiness tracking
    const isReadyRef = useRef(false)
    const resolveReadyRef = useRef<(() => void) | null>(null)
    const readyPromiseRef = useRef<Promise<void> | null>(null)

    // Create the ready promise lazily (only when ready() is called)
    const getReadyPromise = useCallback((): Promise<void> => {
      // If already ready, return resolved promise
      if (isReadyRef.current) {
        return Promise.resolve()
      }

      // Create promise if it doesn't exist
      if (!readyPromiseRef.current) {
        readyPromiseRef.current = new Promise<void>((resolve) => {
          resolveReadyRef.current = resolve
        })
      }

      return readyPromiseRef.current
    }, [])

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
        ready: getReadyPromise,
        isReady: () => isReadyRef.current,
      }),
      [getElements, getElementsByIndex, getSplitInstanceByIndex, getContainers, getReadyPromise]
    )

    // Initialize split text
    useGSAP(() => {
      if (!containerRef.current) return

      const initializeSplit = () => {
        if (!containerRef.current) return

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

        // Mark as ready and resolve any waiting promises
        isReadyRef.current = true
        resolveReadyRef.current?.()
      }

      // Wait for fonts to load before splitting (if enabled)
      if (waitForFonts && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(initializeSplit)
      } else {
        // Fallback for browsers without Font Loading API or if waitForFonts is false
        initializeSplit()
      }

      // Cleanup: SplitText instances must be manually reverted
      // as gsap.context().revert() doesn't automatically handle them
      return () => {
        splitsRef.current.forEach((split) => split?.revert())
        splitsRef.current = []
        containersRef.current = []

        // Reset readiness state for potential remount
        isReadyRef.current = false
        readyPromiseRef.current = null
        resolveReadyRef.current = null
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
