"use client"

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react"

import { useDisableScroll } from "@/lib/hooks/use-disable-scroll"
import { PORTAL_IDS, Z_INDEX_CLASSNAMES } from "@/lib/styles/const"
import { cn } from "@/lib/utils/helpers"

import { Portal } from "../portal"
import { DialogContext } from "./context"
import { useFocusTrap } from "./hooks/use-focus-trap"
import type { DialogAnimationState, DialogProps } from "./types"

/**
 * Main Dialog component using React composition pattern.
 * Provides context for child components and handles animation lifecycle.
 *
 * Features:
 * - GSAP-powered animations for mount/unmount
 * - Focus trapping for accessibility
 * - Escape key to close
 * - Click outside to close (optional)
 * - Scroll lock when open
 *
 * @example
 * ```tsx
 * function CartDialog({ isOpen, onClose }) {
 *   return (
 *     <Dialog isOpen={isOpen} onClose={onClose}>
 *       <DialogOverlay />
 *       <DialogPanel position="right" className="w-full md:w-96 p-6">
 *         <div className="flex items-center justify-between">
 *           <DialogTitle>My Cart</DialogTitle>
 *           <DialogClose />
 *         </div>
 *         <div>Cart content here...</div>
 *       </DialogPanel>
 *     </Dialog>
 *   )
 * }
 * ```
 */
export function Dialog({
  isOpen,
  onClose,
  children,
  className,
  closeOnEscape = true,
}: DialogProps) {
  const dialogId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Track animation state for proper mount/unmount handling
  const [animationState, setAnimationState] = useState<DialogAnimationState>('closed')

  // Determine if dialog should be rendered
  const shouldRender = animationState !== "closed"

  // Handle scroll lock
  useDisableScroll(shouldRender)

  // Handle close request - triggers closing animation
  const handleClose = useCallback(() => {
    if (animationState === 'open' || animationState === 'opening') {
      setAnimationState('closing')
    }
  }, [animationState])

  // Handle focus trap with escape key support
  useFocusTrap(
    panelRef,
    animationState === 'open',
    closeOnEscape ? handleClose : undefined
  )

  // Trigger opening animation when isOpen becomes true
  useEffect(() => {
    if (isOpen && animationState === 'closed') {
      setAnimationState('opening')
    }
  }, [isOpen, animationState])

  // Called when opening animation completes
  const onOpenComplete = useCallback(() => {
    setAnimationState('open')
  }, [])

  // Called when closing animation completes
  const onCloseComplete = useCallback(() => {
    setAnimationState('closed')
    onClose()
  }, [onClose])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    animationState,
    isOpen: shouldRender,
    onClose: handleClose,
    panelRef,
    overlayRef,
    dialogId,
    onOpenComplete,
    onCloseComplete,
  }), [animationState, shouldRender, handleClose, dialogId, onOpenComplete, onCloseComplete])

  // Don't render anything if fully closed
  if (!shouldRender) return null

  return (
    <Portal id={PORTAL_IDS.bodyBottom}>
      <DialogContext.Provider value={contextValue}>
        <div id="dialog" className={cn("fixed inset-0", Z_INDEX_CLASSNAMES.dialog, className)}>
          {children}
        </div>
      </DialogContext.Provider>
    </Portal>
  )
}
