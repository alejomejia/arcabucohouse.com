"use client"

import { cn } from "@/lib/utils/helpers"

import { useDialogContext } from "./context"
import { useDialogAnimation } from "./hooks/use-dialog-animation"
import type { DialogPanelProps } from "./types"

/**
 * Dialog panel component.
 * Contains the main dialog content and handles slide animations.
 *
 * @example
 * ```tsx
 * <Dialog isOpen={isOpen} onClose={handleClose}>
 *   <DialogOverlay />
 *   <DialogPanel position="right" className="w-full md:w-96">
 *     <DialogTitle>My Dialog</DialogTitle>
 *     <p>Content here...</p>
 *     <DialogClose />
 *   </DialogPanel>
 * </Dialog>
 * ```
 */
export function DialogPanel({
  children,
  className,
  position = 'right',
}: DialogPanelProps) {
  const {
    panelRef,
    overlayRef,
    animationState,
    dialogId,
    onOpenComplete,
    onCloseComplete,
  } = useDialogContext()

  // Handle GSAP animations
  useDialogAnimation({
    animationState,
    overlayRef,
    panelRef,
    onOpenComplete,
    onCloseComplete,
  })

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${dialogId}-title`}
      tabIndex={-1}
      className={cn(
        "fixed top-0 bottom-0 right-0 flex flex-col",
        "bg-zinc-900 backdrop-blur-sm border-l border-zinc-800",
        "focus-visible:outline-none",
        className
      )}
    >
      {children}
    </div>
  )
}
