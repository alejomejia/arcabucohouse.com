"use client"

import { useCallback, useMemo, useState } from "react"

import { cn } from "@/lib/utils/helpers"

import { TabsContext } from "./context"
import type { TabsContextValue, TabsProps } from "./types"

/**
 * Root Tabs component using compound pattern.
 *
 * Wrap all tab pieces — TabsList, TabsTrigger, TabsContent — inside this component.
 * Order TabsTrigger and TabsContent elements in the same sequence to swap tabs easily.
 *
 * @example — single mode (one tab visible at a time)
 * ```tsx
 * <Tabs mode="single" defaultOpen="downloads">
 *   <TabsList>
 *     <TabsTrigger id="downloads" icon={<ArrowDownTrayIcon className="size-4" />}>Downloads</TabsTrigger>
 *     <TabsTrigger id="composition" icon={<SwatchIcon className="size-4" />}>Composition & Color</TabsTrigger>
 *   </TabsList>
 *   <TabsContent id="downloads">…</TabsContent>
 *   <TabsContent id="composition">…</TabsContent>
 * </Tabs>
 * ```
 *
 * @example — multiple mode (any number of tabs open simultaneously)
 * ```tsx
 * <Tabs mode="multiple" defaultOpen={["downloads", "care"]}>
 *   <TabsList>
 *     <TabsTrigger id="downloads" icon={<ArrowDownTrayIcon className="size-4" />}>Downloads</TabsTrigger>
 *     <TabsTrigger id="care" icon={<HeartIcon className="size-4" />}>Care & Handling</TabsTrigger>
 *   </TabsList>
 *   <TabsContent id="downloads">…</TabsContent>
 *   <TabsContent id="care">…</TabsContent>
 * </Tabs>
 * ```
 */
export function Tabs({ mode = "single", orientation = "horizontal", defaultOpen, children, className }: TabsProps) {
  const initialOpen = useMemo(() => {
    if (!defaultOpen) return new Set<string>()
    return new Set(Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [openTabs, setOpenTabs] = useState<Set<string>>(initialOpen)

  const toggleTab = useCallback(
    (id: string) => {
      setOpenTabs((prev) => {
        const next = new Set(prev)

        if (mode === "single") {
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

  const contextValue = useMemo<TabsContextValue>(
    () => ({ mode, orientation, openTabs, toggleTab, isOpen }),
    [mode, orientation, openTabs, toggleTab, isOpen],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          "w-full",
          orientation === "vertical" && "flex flex-row",
          className,
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export { TabsList } from "./tabs-list"
export { TabsTrigger } from "./tabs-trigger"
export { TabsContent } from "./tabs-content"
