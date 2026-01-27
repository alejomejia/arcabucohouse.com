"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

type UseElementHasScrollbarReturn<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T | null>
  hasScrollbar: boolean
}

/**
 * Tracks whether the element attached via the returned ref has a vertical scrollbar.
 *
 * Toggles the "has-scrollbar" class on the element when overflow is detected, so
 * other logic (e.g. scroll prevention, styling) can rely on that class without
 * consuming the hook’s return value.
 *
 * Uses ResizeObserver to re-check when the element's size or content changes.
 * Pass dependencies (e.g. `[items.length]`) to force a re-check when content changes
 * in a way that might not trigger ResizeObserver.
 *
 * @param dependencies - Optional deps; when they change, the effect re-runs and re-checks (default: [])
 * @returns Object with `ref` to attach to the scroll container and `hasScrollbar`
 *
 * @example
 * ```tsx
 * function CartItemsList({ items }: { items: CartItem[] }) {
 *   const { ref, hasScrollbar } = useElementHasScrollbar([items.length])
 *   return (
 *     <ul ref={ref} className={cn('overflow-auto', hasScrollbar && 'pr-4')}>
 *       {items.map((item) => <CartItem key={item.id} item={item} />)}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useElementHasScrollbar<T extends HTMLElement = HTMLElement>(
  dependencies: unknown[] = []
): UseElementHasScrollbarReturn<T> {
  const ref = useRef<T>(null)
  const [hasScrollbar, setHasScrollbar] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const isScrollbarVisible = element.scrollHeight > element.clientHeight
      
      setHasScrollbar(isScrollbarVisible)
      element.classList.toggle("has-scrollbar", isScrollbarVisible)
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(element)

    return () => observer.disconnect()
  }, dependencies)

  return { ref, hasScrollbar }
}
