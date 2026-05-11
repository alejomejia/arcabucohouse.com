'use client'

import { createContext, useContext } from 'react'

import type { CursorContextValue } from "./cursor.types"

/**
 * Context for sharing cursor state and controls across the component tree.
 */
export const CursorContext = createContext<CursorContextValue | null>(null)

/**
 * Hook to access the custom cursor context.
 * Must be used within a CustomCursorProvider component.
 *
 * @returns The cursor context value with state and controls
 * @throws Error if used outside of a CustomCursorProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { setHover, setDefault } = useCustomCursor()
 *
 *   return (
 *     <button
 *       onMouseEnter={() => setHover({ text: 'Click me!' })}
 *       onMouseLeave={setDefault}
 *     >
 *       Hover me
 *     </button>
 *   )
 * }
 * ```
 */
export function useCursor(): CursorContextValue {
  const context = useContext(CursorContext)

  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider')
  }

  return context
}
