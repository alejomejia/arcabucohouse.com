"use client"

import { cn } from "@/lib/utils/helpers"

import { TabsContent } from "./tabs-content"
import { TabsList } from "./tabs-list"
import { TabsTrigger } from "./tabs-trigger"
import { TabsContext } from "./tabs.context"
import type { TabsProps } from "./tabs.types"
import { useTabs } from "./use-tabs"

/**
 * Compound tabs primitive. Compose with `Tabs.List`, `Tabs.Trigger`, and
 * `Tabs.Content`; pair each trigger and content by `id`. State lives in
 * the root via {@link useTabs} — sub-components subscribe via context.
 *
 * Two modes:
 * - **single** — one tab open at a time; the active trigger stays selected.
 * - **multiple** — accordion-style; triggers independently toggle their content.
 *
 * @example — single mode
 * ```tsx
 * <Tabs mode="single" defaultOpen="downloads">
 *   <Tabs.List>
 *     <Tabs.Trigger id="downloads">Downloads</Tabs.Trigger>
 *     <Tabs.Trigger id="composition">Composition</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content id="downloads">…</Tabs.Content>
 *   <Tabs.Content id="composition">…</Tabs.Content>
 * </Tabs>
 * ```
 *
 * @example — multiple mode (accordion)
 * ```tsx
 * <Tabs mode="multiple" defaultOpen={["downloads", "care"]}>
 *   <Tabs.List>
 *     <Tabs.Trigger id="downloads">Downloads</Tabs.Trigger>
 *     <Tabs.Trigger id="care">Care</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content id="downloads">…</Tabs.Content>
 *   <Tabs.Content id="care">…</Tabs.Content>
 * </Tabs>
 * ```
 */
function TabsRoot({
  mode = "single",
  orientation = "horizontal",
  defaultOpen,
  children,
  className,
}: TabsProps) {
  const contextValue = useTabs({ mode, orientation, defaultOpen })

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

/** @see {@link TabsRoot} for full usage docs. */
export const Tabs = Object.assign(TabsRoot, {
  /** @see {@link TabsList} */
  List: TabsList,
  /** @see {@link TabsTrigger} */
  Trigger: TabsTrigger,
  /** @see {@link TabsContent} */
  Content: TabsContent,
})

export type * from "./tabs.types"
