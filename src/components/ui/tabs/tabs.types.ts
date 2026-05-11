import type { ReactNode } from "react"

export type TabsMode = 'single' | 'multiple'
export type TabsOrientation = 'horizontal' | 'vertical'

export type TabsContextValue = {
  mode: TabsMode
  orientation: TabsOrientation
  openTabs: Set<string>
  toggleTab: (id: string) => void
  isOpen: (id: string) => boolean
}

export type TabsProps = {
  /** Controls whether one or multiple tabs can be open simultaneously */
  mode?: TabsMode
  /**
   * horizontal — tab list on top, content below (default)
   * vertical   — tab list on the left, content on the right
   */
  orientation?: TabsOrientation
  /** Tab ID(s) open by default — string for single, string[] for multiple */
  defaultOpen?: string | string[]
  children: ReactNode
  className?: string
}

export type TabsListProps = {
  children: ReactNode
  className?: string
}

export type TabsTriggerProps = {
  /** Unique ID that pairs this trigger with its TabsContent */
  id: string
  children: ReactNode
  /** Optional heroicon element */
  icon?: ReactNode
  className?: string
}

export type TabsContentProps = {
  /** Must match the id of the corresponding TabsTrigger */
  id: string
  children: ReactNode
  className?: string
}
