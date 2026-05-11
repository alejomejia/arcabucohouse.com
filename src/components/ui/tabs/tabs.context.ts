"use client"

import { createContext, useContext } from "react"

import type { TabsContextValue } from "./tabs.types"

/**
 * Internal context distributing tabs state (mode, orientation, openTabs,
 * toggleTab, isOpen) from the `<Tabs>` root to `Tabs.List`, `Tabs.Trigger`,
 * and `Tabs.Content`.
 */
export const TabsContext = createContext<TabsContextValue | null>(null)

/**
 * Consume `TabsContext`. Throws when rendered outside a `<Tabs>` tree.
 *
 * @throws when called outside a `<Tabs>`.
 */
export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error("useTabsContext must be used within a Tabs component")
  }

  return context
}
