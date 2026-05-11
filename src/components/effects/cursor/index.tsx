'use client'

import dynamic from 'next/dynamic'
import { useLayoutEffect, useState } from 'react'

import { Portal } from '@/components/ui/portal'
import { useBreakpoint } from '@/lib/hooks/use-breakpoint'
import { PORTAL_IDS } from '@/lib/styles/const'

import { CURSOR_ANIMATION_DURATION, CURSOR_DEFAULT_SIZE, CURSOR_LERP_FACTOR } from './cursor.const'
import { CursorContext } from './cursor.context'
import type { CursorProviderProps } from './cursor.types'
import { useCursorProvider } from './hooks/use-cursor-provider'

// Dynamic import: `CursorElement` transitively pulls `useCursorAnimation`,
// `tempus/react`, and gsap. By dynamic-importing it we keep those out of
// the bundle entry for sessions that never render the cursor (mobile,
// touch-only, SSR).
const CursorElement = dynamic(
  () => import('./cursor-element').then((m) => m.CursorElement),
  { ssr: false },
)

/**
 * Provider component that enables custom cursor functionality.
 *
 * The cursor only renders when:
 * 1. The viewport is at least `lg` (≥ 1024px), and
 * 2. The primary input device has a fine pointer (mouse / trackpad).
 *
 * Below either threshold, this provider still mounts `CursorContext` so
 * `useCursor()` consumers stay valid — their `setHover` / `setDefault`
 * calls become harmless no-ops since no cursor DOM exists.
 *
 * @example
 * ```tsx
 * // In your layout
 * <CursorProvider>
 *   {children}
 * </CursorProvider>
 * ```
 *
 * @example
 * ```tsx
 * // With custom configuration
 * <CursorProvider
 *   defaultSize={20}
 *   animationDuration={0.2}
 *   lerpFactor={0.1}
 * >
 *   {children}
 * </CursorProvider>
 * ```
 */
export function CursorProvider({
  children,
  defaultSize = CURSOR_DEFAULT_SIZE,
  animationDuration = CURSOR_ANIMATION_DURATION,
  lerpFactor = CURSOR_LERP_FACTOR,
}: CursorProviderProps) {
  const { contextValue, isMounted, cursorState } = useCursorProvider()
  const { isLargeScreen } = useBreakpoint()
  const [hasPointer, setHasPointer] = useState(false)

  useLayoutEffect(() => {
    setHasPointer(window.matchMedia('(pointer: fine)').matches)
  }, [])

  const shouldRenderCursor = isMounted && isLargeScreen && hasPointer

  return (
    <CursorContext.Provider value={contextValue}>
      {children}

      {shouldRenderCursor && (
        <Portal id={PORTAL_IDS.bodyTop}>
          <CursorElement
            cursorState={cursorState}
            defaultSize={defaultSize}
            animationDuration={animationDuration}
            lerpFactor={lerpFactor}
          />
        </Portal>
      )}
    </CursorContext.Provider>
  )
}
