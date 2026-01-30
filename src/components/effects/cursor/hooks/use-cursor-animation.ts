'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCallback, useRef, type RefObject } from 'react'
import { useTempus } from 'tempus/react'

import type { CursorInternalState } from '../types'

type UseCursorAnimationProps = {
  animationDuration: number
  lerpFactor: number
}

type UseCursorAnimationReturn = {
  cursorRef: RefObject<HTMLDivElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  updateCursorState: (state: CursorInternalState) => void
}

/**
 * Hook that handles cursor position tracking and GSAP animations.
 * Uses lerp for smooth cursor following and GSAP for state transitions.
 *
 * @param props - Animation configuration
 * @returns Refs and update function for the cursor
 */
export function useCursorAnimation({
  animationDuration,
  lerpFactor,
}: UseCursorAnimationProps): UseCursorAnimationReturn {
  const cursorRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Store mouse position without causing re-renders
  const mousePos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const isInitialized = useRef(false)

  // Track mouse position via event listener
  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      // Initialize position on first move
      if (!isInitialized.current && cursorRef.current) {
        currentPos.current = { x: e.clientX, y: e.clientY }
        gsap.set(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
        })
        isInitialized.current = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  })

  // Smooth cursor following using Tempus frame loop
  useTempus(() => {
    if (!cursorRef.current || !isInitialized.current) return

    // Lerp towards mouse position for smooth following
    currentPos.current.x += (mousePos.current.x - currentPos.current.x) * lerpFactor
    currentPos.current.y += (mousePos.current.y - currentPos.current.y) * lerpFactor

    // Apply transform directly (avoid GSAP for per-frame updates)
    cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`
  })

  // Update cursor appearance based on state
  const updateCursorState = useCallback(
    (state: CursorInternalState) => {
      if (!cursorRef.current) return

      const { state: cursorState, config } = state

      // Determine target scale: 0 when hidden, otherwise default or hover scale
      const baseScale = config.scale ?? 1
      const scale =
        cursorState === 'hidden' ? 0 : cursorState === 'hover' ? baseScale * 2.5 : baseScale

      // Animate cursor scale (scale to 0 when hidden for a smooth transition)
      gsap.to(cursorRef.current, {
        '--cursor-scale': scale,
        duration: animationDuration,
        ease: 'smoothSnap',
      })

      // Animate content visibility
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: cursorState === 'hover' && (config.text || config.content) ? 1 : 0,
          scale: cursorState === 'hover' ? 1 : 0.5,
          duration: animationDuration,
          ease: 'smoothSnap',
        })
      }
    },
    [animationDuration]
  )

  return {
    cursorRef,
    contentRef,
    updateCursorState,
  }
}
