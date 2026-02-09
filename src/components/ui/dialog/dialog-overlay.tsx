"use client"

import { cn } from "@/lib/utils/helpers"

import { useDialogContext } from "./context"
import type { DialogOverlayProps } from "./types"

/**
 * Dialog overlay/backdrop component.
 * Renders a semi-transparent backdrop behind the dialog panel.
 * Automatically handles click-to-close behavior.
 *
 * @example
 * ```tsx
 * <Dialog isOpen={isOpen} onClose={handleClose}>
 *   <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
 *   <DialogPanel>...</DialogPanel>
 * </Dialog>
 * ```
 */
export function DialogOverlay({ className, children }: DialogOverlayProps) {
  const { overlayRef, onClose } = useDialogContext()

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className={cn(
        "fixed inset-0",
        "bg-secondary-600/95",
        "opacity-0",
        className
      )}
      onClick={onClose}
    >
      {children}
    </div>
  )
}
