"use client"

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"

import { useDisableScroll } from "@/lib/hooks/use-disable-scroll"
import { PORTAL_IDS, Z_INDEX_CLASSNAMES } from "@/lib/styles/const"
import { cn } from "@/lib/utils/helpers"

import { Portal } from "../portal"
import { DialogClose } from "./dialog-close"
import { DialogOverlay } from "./dialog-overlay"
import { DialogPanel } from "./dialog-panel"
import { DialogTitle } from "./dialog-title"
import { DialogContext } from "./dialog.context"
import type { DialogAnimationState, DialogProps } from "./dialog.types"
import { useFocusTrap } from "./hooks/use-focus-trap"

/**
 * Slide-out modal dialog with GSAP-powered animations, focus trapping,
 * scroll lock, and Escape-to-close. Renders into the body-bottom portal.
 *
 * Sub-components are exposed via the compound API; render them inside
 * `<Dialog>` to wire up state and accessibility automatically.
 *
 * @example
 * ```tsx
 * <Dialog isOpen={isOpen} onClose={handleClose}>
 *   <Dialog.Overlay />
 *   <Dialog.Panel position="right" className="w-full md:w-96 p-6">
 *     <div className="flex items-center justify-between">
 *       <Dialog.Title>My Cart</Dialog.Title>
 *       <Dialog.Close />
 *     </div>
 *     <p>Cart contents…</p>
 *   </Dialog.Panel>
 * </Dialog>
 * ```
 */
function DialogRoot({
  isOpen,
  onClose,
  children,
  className,
  closeOnEscape = true,
}: DialogProps) {
  const dialogId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [animationState, setAnimationState] = useState<DialogAnimationState>('closed')
  const shouldRender = animationState !== "closed"

  useDisableScroll(shouldRender)

  const handleClose = useCallback(() => {
    if (animationState === 'open' || animationState === 'opening') {
      setAnimationState('closing')
    }
  }, [animationState])

  useFocusTrap(
    panelRef,
    animationState === 'open',
    closeOnEscape ? handleClose : undefined,
  )

  useEffect(() => {
    if (isOpen && animationState === 'closed') {
      setAnimationState('opening')
    }
  }, [isOpen, animationState])

  const onOpenComplete = useCallback(() => {
    setAnimationState('open')
  }, [])

  const onCloseComplete = useCallback(() => {
    setAnimationState('closed')
    onClose()
  }, [onClose])

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

/** @see {@link DialogRoot} for full usage docs. */
export const Dialog = Object.assign(DialogRoot, {
  /** @see {@link DialogClose} */
  Close: DialogClose,
  /** @see {@link DialogOverlay} */
  Overlay: DialogOverlay,
  /** @see {@link DialogPanel} */
  Panel: DialogPanel,
  /** @see {@link DialogTitle} */
  Title: DialogTitle,
})

export type * from "./dialog.types"
