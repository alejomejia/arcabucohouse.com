'use client'

import { useCallback, useMemo, useState } from 'react'

import type { TabsContextValue, TabsMode, TabsOrientation } from './tabs.types'

type UseTabsOptions = {
  mode: TabsMode
  orientation: TabsOrientation
  defaultOpen?: string | string[]
}

/**
 * State + context-value builder for the `<Tabs>` root. Owns the open-set
 * and the `toggleTab` semantics (single vs. multiple). Memoized so
 * consumers don't re-render unless the relevant slice changed.
 *
 * @example
 * ```tsx
 * const contextValue = useTabs({ mode: 'single', orientation: 'horizontal', defaultOpen: 'tab-1' })
 * return <TabsContext.Provider value={contextValue}>…</TabsContext.Provider>
 * ```
 */
export function useTabs({ mode, orientation, defaultOpen }: UseTabsOptions): TabsContextValue {
  const initialOpen = useMemo(() => {
    if (!defaultOpen) return new Set<string>()
    return new Set(Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [openTabs, setOpenTabs] = useState<Set<string>>(initialOpen)

  const toggleTab = useCallback(
    (id: string) => {
      setOpenTabs((prev) => {
        const next = new Set(prev)

        if (mode === 'single') {
          if (next.has(id)) return prev // active tab stays open in single mode
          next.clear()
          next.add(id)
        } else {
          if (next.has(id)) next.delete(id)
          else next.add(id)
        }

        return next
      })
    },
    [mode],
  )

  const isOpen = useCallback((id: string) => openTabs.has(id), [openTabs])

  return useMemo<TabsContextValue>(
    () => ({ mode, orientation, openTabs, toggleTab, isOpen }),
    [mode, orientation, openTabs, toggleTab, isOpen],
  )
}
