"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"

import { FOCUS_RING_ON_DARK_BG } from "@/lib/styles/const"
import { cn } from "@/lib/utils/helpers"

import { useDialogContext } from "./context"
import type { DialogCloseProps } from "./types"

/**
 * Dialog close button component.
 * Renders a button that closes the dialog when clicked.
 * Includes default X icon and accessible label.
 *
 * @example
 * ```tsx
 * <DialogPanel>
 *   <div className="flex justify-between">
 *     <DialogTitle>My Dialog</DialogTitle>
 *     <DialogClose />
 *   </div>
 * </DialogPanel>
 * ```
 */
export function DialogClose({
  className,
  children,
}: DialogCloseProps) {
  const { onClose } = useDialogContext()

  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close dialog"
      className={cn(
        "group relative flex items-center justify-center",
        "size-11",
        "text-white bg-primary-400",
        "transition-colors",
        FOCUS_RING_ON_DARK_BG,
        className
      )}
    >
      {children ?? (
        <XMarkIcon className="h-6 duration-300 transition-all ease-in-out group-hover:scale-110 group-hover:rotate-90" />
      )}
    </button>
  )
}
