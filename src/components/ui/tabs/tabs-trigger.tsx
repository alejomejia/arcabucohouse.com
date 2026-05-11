"use client"

import { ChevronDownIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils/helpers"

import { TABS_PANEL_ID_PREFIX, TABS_TRIGGER_ID_PREFIX } from "./tabs.const"
import { useTabsContext } from "./tabs.context"
import type { TabsTriggerProps } from "./tabs.types"

/**
 * Clickable trigger that opens/closes the matching TabsContent.
 *
 * - single mode    — only one tab can be open; clicking the active trigger is a no-op.
 * - multiple mode  — each trigger independently toggles its content; a rotating
 *                    chevron communicates the open/closed state.
 * - horizontal     — active indicator is a bottom border (default).
 * - vertical       — active indicator is a right border; trigger spans full list width.
 *
 * The `id` prop must match the `id` of the corresponding `<TabsContent>`.
 *
 * @example
 * ```tsx
 * <TabsTrigger id="downloads" icon={<ArrowDownTrayIcon className="size-4" />}>
 *   Downloads
 * </TabsTrigger>
 * ```
 */
export function TabsTrigger({ id, children, icon, className }: TabsTriggerProps) {
  const { toggleTab, isOpen, mode, orientation } = useTabsContext()
  const isTabOpen = isOpen(id)
  const isVertical = orientation === "vertical"

  return (
    <button
      type="button"
      role="tab"
      id={`${TABS_TRIGGER_ID_PREFIX}-${id}`}
      aria-selected={isTabOpen}
      // In `multiple` mode the trigger behaves like a disclosure button —
      // expose `aria-expanded` so accordion-style usage is announced to
      // assistive tech. `aria-selected` is kept as the tabs-pattern fallback.
      aria-expanded={mode === 'multiple' ? isTabOpen : undefined}
      aria-controls={`${TABS_PANEL_ID_PREFIX}-${id}`}
      onClick={() => toggleTab(id)}
      className={cn(
        "group relative flex items-center gap-2",
        "text-xs uppercase tracking-widest font-semibold whitespace-nowrap",
        "transition-colors duration-300 ease-in-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
        // Horizontal layout
        !isVertical && "px-4 py-3.5 border-b-2 -mb-px",
        // Vertical layout
        isVertical && "w-full px-5 py-4 justify-start border-r-2 -mr-px text-left",
        // Active / inactive states
        isTabOpen
          ? "text-zinc-900 border-zinc-900"
          : "text-zinc-400 border-transparent hover:text-zinc-600 hover:border-zinc-300",
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "shrink-0 size-4",
            "transition-colors duration-300 ease-in-out",
            isTabOpen ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600",
          )}
        >
          {icon}
        </span>
      )}

      <span className="flex-1">{children}</span>

      {/* Chevron — only in multiple mode as open/close affordance */}
      {mode === "multiple" && (
        <ChevronDownIcon
          className={cn(
            "ml-1 size-3 shrink-0",
            "transition-transform duration-300 ease-in-out",
            isTabOpen ? "rotate-180" : "rotate-0",
          )}
        />
      )}
    </button>
  )
}
