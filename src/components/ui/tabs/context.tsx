"use client"

import { createContext, useContext } from "react"

import type { TabsContextValue } from "./types"

export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error("useTabsContext must be used within a Tabs component")
  }

  return context
}
