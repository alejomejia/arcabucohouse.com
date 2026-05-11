"use client"

import { cn } from "@/lib/utils/helpers"

import { useDialogContext } from "./dialog.context"
import type { DialogTitleProps } from "./dialog.types"

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
      className={cn("text-zinc-50 text-2xl font-semibold", className)}
    >
      {children}
    </Heading>
  )
}
