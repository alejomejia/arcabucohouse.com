"use client"

import { cn } from "@/lib/utils/helpers"

import { useTabsContext } from "./tabs.context"
import type { TabsListProps } from "./tabs.types"

/**
 * Container for TabsTrigger elements.
 *
 * - horizontal — scrollable row with a bottom border separator (default)
 * - vertical   — fixed column with a right border separator
 *
 * @example
 * ```tsx
 * <TabsList>
 *   <TabsTrigger id="tab-a">Tab A</TabsTrigger>
 *   <TabsTrigger id="tab-b">Tab B</TabsTrigger>
 * </TabsList>
 * ```
 */
export function TabsList({ children, className }: TabsListProps) {
  const { orientation } = useTabsContext()
  const isVertical = orientation === "vertical"

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        "flex gap-0",
        isVertical
          ? "flex-col shrink-0 border-r border-zinc-200 w-52"
          : "flex-row items-end border-b border-zinc-200 overflow-x-auto scrollbar-none",
        className,
      )}
    >
      {children}
    </div>
  )
}
