"use client"

import { cn } from "@/lib/utils/helpers"

import { useDialogContext } from "./context"
import type { DialogTitleProps } from "./types"

/**
 * Dialog title component.
 * Renders the accessible title for the dialog.
 * Automatically linked to the dialog via aria-labelledby.
 *
 * @example
 * ```tsx
 * <DialogPanel>
 *   <DialogTitle>My Dialog Title</DialogTitle>
 * </DialogPanel>
 * ```
 */
export function DialogTitle({
  children,
  className,
  as: Heading = 'h2',
}: DialogTitleProps) {
  const { dialogId } = useDialogContext()

  return (
    <Heading
      id={`${dialogId}-title`}
      className={cn("text-white text-2xl font-semibold font-serif", className)}
    >
      {children}
    </Heading>
  )
}
