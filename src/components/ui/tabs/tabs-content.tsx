"use client"

import { cn } from "@/lib/utils/helpers"

import { useTabsContext } from "./context"
import type { TabsContentProps } from "./types"

/**
 * Content panel for a tab. Must have an `id` matching its `<TabsTrigger>`.
 *
 * Animation is CSS-only:
 * - single   → inactive panels are hidden (display:none); active panel fades in
 *              via @keyframes tab-fade-in defined in utilities.css.
 * - multiple → CSS grid-template-rows accordion (0fr ↔ 1fr) with opacity.
 *              Works for any content height without measuring the DOM.
 *
 * @example
 * ```tsx
 * <TabsContent id="downloads">
 *   <p>Download files here…</p>
 * </TabsContent>
 * ```
 */
export function TabsContent({ id, children, className }: TabsContentProps) {
  const { isOpen, mode, orientation } = useTabsContext()
  const isTabOpen = isOpen(id)
  const isVertical = orientation === "vertical"

  // ── Multiple mode: CSS grid-rows accordion ──────────────────────────────────
  if (mode === "multiple") {
    return (
      <div
        role="tabpanel"
        id={`tabpanel-${id}`}
        aria-labelledby={`tab-${id}`}
        aria-hidden={!isTabOpen}
        // grid-template-rows animates between 0fr and 1fr — works for any height
        className={cn(
          "grid transition-all duration-500 ease-out",
          isVertical ? "flex-1 min-w-0" : "",
          isTabOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        {/* min-h-0 + overflow-hidden are required for the grid trick to clip content */}
        <div className="min-h-0 overflow-hidden">
          <div className={cn(isVertical ? "px-8 py-6" : "py-6", className)}>
            {children}
          </div>
        </div>
      </div>
    )
  }

  // ── Single mode: hidden + CSS keyframe fade-in ──────────────────────────────
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      aria-hidden={!isTabOpen}
      className={cn(
        isVertical ? "flex-1 min-w-0" : "",
        !isTabOpen && "hidden",
      )}
    >
      {/*
        key={isTabOpen} remounts this div when the panel opens, restarting the
        CSS animation from scratch — no JS timing required.
      */}
      {isTabOpen && (
        <div
          key={id}
          className={cn(
            "animate-tab-fade-in",
            isVertical ? "px-8 py-6" : "py-6",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
