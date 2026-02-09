'use client'

import { useEffect, useEffectEvent, useRef, type ElementType } from 'react'

import { cn } from '@/lib/utils/helpers'

import { useCursor } from './context'
import type { CursorConfig, CursorTriggerProps } from './types'

/**
 * Wrapper component that triggers cursor state changes on hover.
 * Provides a declarative way to customize the cursor for specific elements.
 * Syncs cursor state when config (e.g. hidden) changes while the pointer is over the element.
 * Uses stable event handlers (ref + useEffectEvent) so inline config does not cause child re-renders.
 *
 * @example
 * ```tsx
 * // Simple text cursor
 * <CursorTrigger config={{ text: 'View' }}>
 *   <img src="/photo.jpg" alt="Photo" />
 * </CursorTrigger>
 *
 * // Custom content cursor
 * <CursorTrigger config={{ content: <PlayIcon />, scale: 1.5 }}>
 *   <video src="/video.mp4" />
 * </CursorTrigger>
 *
 * // Hide cursor on hover
 * <CursorTrigger config={{ hidden: true }}>
 *   <CustomCursorArea />
 * </CursorTrigger>
 * ```
 */
export function CursorTrigger({
  children,
  config,
  className,
  as = 'div',
}: CursorTriggerProps) {
  const { setHover, setDefault, hide } = useCursor()
  const configRef = useRef<CursorConfig | undefined>(config)
  const isHoveredRef = useRef(false)

  configRef.current = config

  const handleMouseEnter = useEffectEvent(() => {
    isHoveredRef.current = true
    const current = configRef.current
    if (current?.hidden) {
      hide()
    } else {
      setHover(current)
    }
  })

  const handleMouseLeave = useEffectEvent(() => {
    isHoveredRef.current = false
    setDefault()
  })

  const onSyncCursor = useEffectEvent(() => {
    const current = configRef.current
    if (current?.hidden) {
      hide()
    } else {
      setHover(current)
    }
  })

  useEffect(() => {
    if (!isHoveredRef.current) return
    onSyncCursor()
  }, [config])

  const Component = as as ElementType

  return (
    <Component
      className={cn('cursor-none', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Component>
  )
}
