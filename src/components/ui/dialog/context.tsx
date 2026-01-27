"use client"

import { createContext, useContext } from "react"

import type { DialogContextValue } from "./types"

/**
 * Context for sharing dialog state across the component tree.
 * Provides animation state, controls, and refs to child components.
 */
export const DialogContext = createContext<DialogContextValue | null>(null)

/**
 * Hook to access the dialog context.
 * Must be used within a Dialog component.
 *
 * @returns The dialog context value
 * @throws Error if used outside of a Dialog component
 *
 * @example
 * ```tsx
 * function MyDialogContent() {
 *   const { onClose, isOpen } = useDialogContext()
 *   return <button onClick={onClose}>Close</button>
 * }
 * ```
 */
export function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('useDialogContext must be used within a Dialog component')
  }

  return context
}
