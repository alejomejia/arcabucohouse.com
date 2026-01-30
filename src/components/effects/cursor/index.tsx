'use client'

import { Portal } from '@/components/ui/portal'
import { PORTAL_IDS } from '@/lib/styles/const'

import { CursorContext } from './context'
import { CursorElement } from './cursor-element'
import { useCursorProvider } from './hooks/use-cursor-provider'
import type { CursorProviderProps } from './types'

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
  defaultSize = 8,
  animationDuration = 0.15,
  lerpFactor = 0.15,
}: CursorProviderProps) {
  const { contextValue, isMounted, cursorState } = useCursorProvider()

  return (
    <CursorContext.Provider value={contextValue}>
      {children}

      {isMounted && (
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
