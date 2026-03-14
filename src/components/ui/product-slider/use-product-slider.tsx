"use client"

import { useCallback, useEffect, useEffectEvent, useRef, useState, type MouseEvent, type PointerEvent } from "react"

import type { Product } from "@/lib/integrations/shopify/types"
import { twoDigits } from "@/lib/utils/strings"

import { buildLines, createLineBuffer, updateLines } from "./product-slider.utils"

type DragState = {
  isPointerDown: boolean
  isDragging: boolean
  startX: number
  velocity: number
  lastX: number
  lastTime: number
  animX: number
}

/** Cached layout measurements — stable until window resize. */
type LayoutCache = {
  sliderWidth: number
  sliderLeft: number
  oneSetWidth: number
  /** Each item's left offset from slider left at wrapped=0. */
  itemOffsets: number[]
  itemWidths: number[]
}

type UseProductSliderOptions = {
  products: Product[]
  /** Auto-scroll speed in px/frame (default: 0.5). */
  autoScrollSpeed?: number
  /** Render a debug line at the active-index trigger point. */
  debug?: boolean
}

/**
 * Manages all slider behaviour: auto-scroll, drag with momentum, wheel scroll,
 * seamless infinite looping, per-slide parallax, and imperative heading/pagination updates.
 *
 * Client-side only — relies on `requestAnimationFrame`, pointer events, and direct DOM writes.
 *
 * @param products - Product list used to resolve active heading text and compute progress.
 * @param autoScrollSpeed - Auto-scroll speed in px/frame (default: 0.5).
 * @returns Refs and event handlers consumed by sub-components via `ProductSliderContext`.
 *
 * @example
 * ```tsx
 * const slider = useProductSlider({ products, autoScrollSpeed: 0.3 })
 * ```
 */
export function useProductSlider({ products, autoScrollSpeed = 0.5, debug = false }: UseProductSliderOptions) {
  const itemCount = products.length
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<HTMLDivElement[]>([])
  const momentumId = useRef<number | null>(null)
  const autoScrollId = useRef<number | null>(null)

  // DOM refs for imperative updates (no re-renders)
  const categoryRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const activeIndexRef = useRef<HTMLSpanElement>(null)
  const lineRefs = useRef<HTMLDivElement[]>([])

  // Pre-allocated buffer for pagination line updates (zero per-frame allocation)
  const linesBuffer = useRef(createLineBuffer())

  const [isGrabbing, setIsGrabbing] = useState(false)
  const [showCursorDrag, setShowCursorDrag] = useState(true)

  const dragState = useRef<DragState>({
    isPointerDown: false,
    isDragging: false,
    startX: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
    animX: 0,
  })

  const lastActiveIndex = useRef(-1)
  const didDragRef = useRef(false)

  // ── Layout cache (no DOM reads in hot path) ───────────────────────────────

  const layout = useRef<LayoutCache>({
    sliderWidth: 0,
    sliderLeft: 0,
    oneSetWidth: 0,
    itemOffsets: [],
    itemWidths: [],
  })

  const measureLayout = useEffectEvent(() => {
    if (!sliderRef.current || !containerRef.current) return
    const sliderRect = sliderRef.current.getBoundingClientRect()
    const currentWrapped = dragState.current.animX
    const l = layout.current

    l.sliderWidth = sliderRect.width
    l.sliderLeft = sliderRect.left
    l.oneSetWidth = containerRef.current.scrollWidth / 2

    itemRefs.current.forEach((el, i) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      // Base offset at wrapped=0: subtract current translation to get the static value
      l.itemOffsets[i] = rect.left - sliderRect.left - currentWrapped
      l.itemWidths[i] = rect.width
    })
  })

  // ── Core animation ────────────────────────────────────────────────────────

  const applyX = useEffectEvent((x: number) => {
    if (!containerRef.current) return

    const { sliderWidth, sliderLeft, oneSetWidth, itemOffsets, itemWidths } = layout.current
    if (oneSetWidth === 0) return

    // Wrap position within one set
    let wrapped = x % oneSetWidth
    if (wrapped > 0) wrapped -= oneSetWidth
    dragState.current.animX = wrapped

    // Single DOM write — no reads follow
    containerRef.current.style.transform = `translateX(${wrapped}px)`

    // Compute item positions from cache — zero getBoundingClientRect calls
    const triggerPoint = window.innerWidth / 2 - sliderLeft
    let newIndex = lastActiveIndex.current === -1 ? 0 : lastActiveIndex.current
    let closestDist = Infinity

    for (let i = 0; i < itemOffsets.length; i++) {
      const el = itemRefs.current[i]
      const offset = itemOffsets[i]
      const width = itemWidths[i]
      if (!el || offset === undefined || width === undefined) continue

      const itemCenter = offset + wrapped + width / 2

      const relPos = (itemCenter / sliderWidth - 0.5) * 2
      const p = Math.min(1, Math.abs(relPos))
      el.style.setProperty('--p', p.toFixed(3))

      const dist = Math.abs(itemCenter - triggerPoint)
      if (dist < closestDist) {
        closestDist = dist
        newIndex = i % itemCount
      }
    }

    // Update pagination lines (mutates pre-allocated buffer — zero allocation)
    const prog = newIndex / itemCount
    const lines = linesBuffer.current
    updateLines(prog, lines)
    for (let i = 0; i < lineRefs.current.length; i++) {
      const el = lineRefs.current[i]
      const line = lines[i]
      if (!el || !line) continue
      el.style.setProperty('--x', `${line.x}px`)
      el.style.setProperty('--scale-y', String(line.scaleY))
      el.style.setProperty('--opacity', String(line.opacity))
    }

    // Update heading when active product changes
    if (newIndex !== lastActiveIndex.current) {
      lastActiveIndex.current = newIndex
      if (activeIndexRef.current) {
        activeIndexRef.current.textContent = twoDigits(newIndex)
      }
      const product = products[newIndex]
      if (product) {
        if (categoryRef.current) categoryRef.current.textContent = product.category?.title ?? ""
        if (titleRef.current) titleRef.current.textContent = product.title
      }
    }
  })

  // ── Auto-scroll ──────────────────────────────────────────────────────────

  const startAutoScroll = useEffectEvent(() => {
    if (autoScrollId.current) cancelAnimationFrame(autoScrollId.current)

    const tick = () => {
      if (dragState.current.isDragging) {
        autoScrollId.current = requestAnimationFrame(tick)
        return
      }
      dragState.current.animX -= autoScrollSpeed
      applyX(dragState.current.animX)
      autoScrollId.current = requestAnimationFrame(tick)
    }

    autoScrollId.current = requestAnimationFrame(tick)
  })

  const stopAutoScroll = useEffectEvent(() => {
    if (autoScrollId.current) {
      cancelAnimationFrame(autoScrollId.current)
      autoScrollId.current = null
    }
  })

  // ── Momentum ─────────────────────────────────────────────────────────────

  const cancelMomentum = useEffectEvent(() => {
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current)
      momentumId.current = null
    }
  })

  const startMomentum = useEffectEvent((velocity: number) => {
    cancelMomentum()
    if (Math.abs(velocity) < 0.3) return

    stopAutoScroll()

    const tick = () => {
      const ds = dragState.current
      ds.velocity *= 0.94

      if (Math.abs(ds.velocity) < 0.3) {
        momentumId.current = null
        startAutoScroll()
        return
      }

      ds.animX += ds.velocity
      applyX(ds.animX)
      momentumId.current = requestAnimationFrame(tick)
    }

    dragState.current.velocity = velocity
    momentumId.current = requestAnimationFrame(tick)
  })

  // ── Pointer events ───────────────────────────────────────────────────────

  /** Minimum movement in px before a pointer interaction is treated as a drag. */
  const DRAG_THRESHOLD = 5

  const onPointerDown = useEffectEvent((e: PointerEvent) => {
    cancelMomentum()

    // Momentum stops auto-scroll; restart it so it resumes on pointer up
    if (!autoScrollId.current) startAutoScroll()

    const ds = dragState.current
    // Do NOT set isDragging=true or capture the pointer yet.
    // Capture is deferred to onPointerMove once the drag threshold is exceeded,
    // so that plain clicks still reach child <Link> elements.
    didDragRef.current = false
    ds.isPointerDown = true
    ds.isDragging = false
    ds.startX = e.clientX
    ds.lastX = e.clientX
    ds.lastTime = Date.now()
    ds.velocity = 0
  })

  const onPointerMove = useEffectEvent((e: PointerEvent) => {
    const ds = dragState.current
    if (!ds.isPointerDown) return
    const dx = e.clientX - ds.lastX

    if (!ds.isDragging) {
      // Start drag mode only after the threshold is crossed
      if (Math.abs(e.clientX - ds.startX) < DRAG_THRESHOLD) return
      ds.isDragging = true
      setIsGrabbing(true)
      setShowCursorDrag(false)
      // Capture here so out-of-bounds dragging still works,
      // but clicks on children are never redirected for short taps
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    const now = Date.now()
    const dt = now - ds.lastTime || 1
    ds.velocity = (dx / dt) * 16
    ds.lastX = e.clientX
    ds.lastTime = now
    applyX(ds.animX + dx)
  })

  const onPointerUp = useEffectEvent(() => {
    const ds = dragState.current
    ds.isPointerDown = false
    if (!ds.isDragging) return
    didDragRef.current = true
    ds.isDragging = false
    setIsGrabbing(false)
    startMomentum(ds.velocity)
  })

  const onLostPointerCapture = useEffectEvent(() => {
    const ds = dragState.current
    if (!ds.isDragging) return
    ds.isPointerDown = false
    ds.isDragging = false
    setIsGrabbing(false)
    startMomentum(ds.velocity)
  })

  const onClickCapture = useEffectEvent((e: MouseEvent) => {
    if (!didDragRef.current) return
    didDragRef.current = false
    e.preventDefault()
    e.stopPropagation()
  })

  // ── Init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    measureLayout()
    applyX(0)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          startAutoScroll()
        } else {
          stopAutoScroll()
          cancelMomentum()
        }
      },
      { threshold: 0 }
    )

    observer.observe(slider)
    window.addEventListener("resize", measureLayout)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measureLayout)
      stopAutoScroll()
      cancelMomentum()
    }
  }, [])

  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      if (el) itemRefs.current[index] = el
    },
    []
  )

  const setLineRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      if (el) lineRefs.current[index] = el
    },
    []
  )

  return {
    sliderRef,
    containerRef,
    setItemRef,
    categoryRef,
    titleRef,
    activeIndexRef,
    showCursorDrag,
    setLineRef,
    initialLines: buildLines(0),
    isGrabbing,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onLostPointerCapture,
    onClickCapture,
    debug,
  }
}
