import type { JSX, ReactNode } from 'react'

/**
 * Cursor states for different interaction modes.
 */
export type CursorState = 'default' | 'hover' | 'hidden'

/**
 * Configuration for a cursor hover effect.
 */
export type CursorConfig = {
  /** Text to display inside the cursor */
  text?: string
  /** Custom content to render inside the cursor */
  content?: ReactNode
  /** Whether to hide the cursor completely */
  hidden?: boolean
  /** Custom size multiplier (1 = default size) */
  scale?: number
  /** Additional CSS class for the cursor element */
  className?: string
  /** Additional CSS class for the cursor follower */
  followerClassName?: string
  /** Additional CSS class for the cursor content */
  contentClassName?: string
}

/**
 * Internal cursor state managed by the context.
 */
export type CursorInternalState = {
  state: CursorState
  config: CursorConfig
}

/**
 * Methods to control the cursor from anywhere in the app.
 */
export type CursorControls = {
  /** Set cursor to hover state with optional config */
  setHover: (config?: CursorConfig) => void
  /** Reset cursor to default state */
  setDefault: () => void
  /** Hide the cursor completely */
  hide: () => void
  /** Show the cursor (from hidden state) */
  show: () => void
}

export type CursorContextValue = CursorControls & {
  cursorState: CursorInternalState
}

export type CursorProviderProps = {
  children: ReactNode
  /** Default cursor size in pixels */
  defaultSize?: number
  /** Animation duration in seconds */
  animationDuration?: number
  /** Lerp factor for smooth following */
  lerpFactor?: number
}

export type CursorTriggerProps = {
  children: ReactNode
  /** Cursor config to apply on hover */
  config?: CursorConfig
  /** Additional class name for the wrapper */
  className?: string
  /** HTML element to render (default: 'div') */
  as?: keyof JSX.IntrinsicElements
}
