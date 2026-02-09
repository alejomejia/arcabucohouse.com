'use client'

import { type CSSProperties, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils/helpers'

import { useCursorAnimation } from './hooks/use-cursor-animation'
import type { CursorInternalState } from './types'

type CursorElementProps = {
  cursorState: CursorInternalState
  defaultSize: number
  animationDuration: number
  lerpFactor: number
}

/** Primitive key for effect deps to avoid redundant GSAP runs when state is referentially new but semantically same. */
function cursorStateKey(state: CursorInternalState): string {
  const { state: s, config } = state
  const hasContent = config.content != null ? '1' : '0'
  return `${s}-${config.hidden ?? false}-${config.scale ?? 1}-${config.text ?? ''}-${hasContent}`
}

/**
 * The visual cursor element that follows the mouse.
 * Rendered through a portal at the top of the body.
 */
export function CursorElement({
  cursorState,
  defaultSize,
  animationDuration,
  lerpFactor,
}: CursorElementProps) {
  const { config } = cursorState
  const stateRef = useRef<CursorInternalState>(cursorState)
  stateRef.current = cursorState

  const { cursorRef, contentRef, updateCursorState } = useCursorAnimation({
    animationDuration,
    lerpFactor,
  })

  const style = {
    '--cursor-scale': 1,
    '--cursor-size': `${defaultSize / 16}rem`,
  } as CSSProperties

  useEffect(() => {
    updateCursorState(stateRef.current)
  }, [cursorStateKey(cursorState), updateCursorState])

  return (
    <div
      ref={cursorRef}
      className={cn(
        "hidden lg:block",
        'fixed top-0 left-0 z-9999',
        'pointer-events-none',
        '-translate-x-1/2 -translate-y-1/2',
        'opacity-0',
        'mix-blend-difference',
        config.className
      )}
      style={style}
    >
      {/* Cursor dot/circle */}
      <div
        className={cn(
          'flex items-center justify-center',
          'w-[calc(var(--cursor-size)*var(--cursor-scale))]',
          'h-[calc(var(--cursor-size)*var(--cursor-scale))]',
          'bg-white rounded-full',
          'transition-[width,height] duration-150 ease-out',
          config.followerClassName
        )}
      >
        {/* Content container */}
        <div
          ref={contentRef}
          className={cn(
            'opacity-0',
            'scale-50',
            'text-sm font-medium',
            'text-primary-600',
            'whitespace-nowrap',
            'select-none',
            'flex items-center justify-center',
            config.contentClassName
          )}
        >
          {config.content || config.text}
        </div>
      </div>
    </div>
  )
}
