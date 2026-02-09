import type { ReactNode, RefObject } from "react"

const DIALOG_ANIMATION_STATES = ['closed', 'opening', 'open', 'closing'] as const
/**
 * Animation state for the dialog lifecycle.
 * - 'closed': Dialog is not rendered
 * - 'opening': Dialog is animating in
 * - 'open': Dialog is fully visible
 * - 'closing': Dialog is animating out
 */
export type DialogAnimationState = (typeof DIALOG_ANIMATION_STATES)[number]

/**
 * Context value for the Dialog component tree.
 * Provides animation state and controls to child components.
 */
export type DialogContextValue = {
  /** Current animation state of the dialog */
  animationState: DialogAnimationState
  /** Whether the dialog is currently open or animating */
  isOpen: boolean
  /** Callback to request closing the dialog */
  onClose: () => void
  /** Ref to the panel element for focus management */
  panelRef: RefObject<HTMLDivElement | null>
  /** Ref to the overlay element for animations */
  overlayRef: RefObject<HTMLDivElement | null>
  /** Unique ID for accessibility attributes */
  dialogId: string
  /** Called when opening animation completes */
  onOpenComplete: () => void
  /** Called when closing animation completes */
  onCloseComplete: () => void
}

/**
 * Props for the main Dialog component.
 */
export type DialogProps = {
  /** Whether the dialog should be open */
  isOpen: boolean
  /** Callback when the dialog requests to close */
  onClose(): void
  /** Dialog content using composition pattern */
  children: ReactNode
  /** Optional class name for the dialog container */
  className?: string
  /** Whether to close on Escape key (default: true) */
  closeOnEscape?: boolean
}

/**
 * Props for the DialogOverlay component.
 */
export type DialogOverlayProps = {
  /** Optional class name for styling */
  className?: string
  /** Optional children to render inside overlay */
  children?: ReactNode
}

/**
 * Props for the DialogPanel component.
 */
export type DialogPanelProps = {
  /** Panel content */
  children: ReactNode
  /** Optional class name for styling */
  className?: string
  /** Panel position: 'left' slides from left, 'right' slides from right */
  position?: 'left' | 'right'
}

/**
 * Props for the DialogClose component.
 */
export type DialogCloseProps = {
  /** Optional class name for styling */
  className?: string
  /** Optional children (default renders X icon) */
  children?: ReactNode
}

/**
 * Props for the DialogTitle component.
 */
export type DialogTitleProps = {
  /** Title content */
  children: ReactNode
  /** Optional class name for styling */
  className?: string
  /** HTML element to render (default: h2) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
