'use client'

import { useLayoutEffect, useState } from 'react'

import { Portal } from '@/components/ui/portal'
import { PORTAL_IDS } from '@/lib/styles/const'

import { CURSOR_ANIMATION_DURATION, CURSOR_DEFAULT_SIZE, CURSOR_LERP_FACTOR } from "./cursor.const"
import { CursorContext } from "./cursor.context"
import { CursorElement } from './cursor-element'
import type { CursorProviderProps } from "./cursor.types"
import { useCursorProvider } from './hooks/use-cursor-provider'

/**
 * Provider component that enables custom cursor functionality.
 * Wrap your app or a section of your app with this provider to enable
 * the custom cursor effect.
 *
 * @example
 * ```tsx
 * // In your layout or page
 * export default function Layout({ children }) {
 *   return (
 *     <CursorProvider>
 *       {children}
 *     </CursorProvider>
 *   )
 * }
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
  const [hasPointer, setHasPointer] = useState(false)

  useLayoutEffect(() => {
    setHasPointer(window.matchMedia('(pointer: fine)').matches)
  }, [])

  return (
    <CursorContext.Provider value={contextValue}>
      {children}

      {isMounted && hasPointer && (
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
