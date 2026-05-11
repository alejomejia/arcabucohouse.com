"use client"

import { cn } from "@/lib/utils/helpers"

import { useDialogContext } from "./dialog.context"
import type { DialogPanelProps } from "./dialog.types"
import { useDialogAnimation } from "./hooks/use-dialog-animation"

/**
 * Dialog panel component. Contains the main dialog content, handles
 * slide animations, and carries `role="dialog"` + `aria-modal="true"`.
 *
 * **Accessibility invariant**: every `Dialog.Panel` must contain a
 * `Dialog.Title` so the `aria-labelledby` chain resolves to a real label.
 * The panel renders with `aria-labelledby={`${dialogId}-title`}`; when no
 * `Dialog.Title` is rendered, that id has no match and assistive tech
 * announces the dialog without a name.
 *
 * If a visible title isn't appropriate, render an `sr-only`
 * `Dialog.Title` to keep the chain valid.
 *
 * @example
 * ```tsx
 * <Dialog isOpen={isOpen} onClose={handleClose}>
 *   <Dialog.Overlay />
 *   <Dialog.Panel position="right" className="w-full md:w-96">
 *     <Dialog.Title>My Dialog</Dialog.Title>
 *     <p>Content here...</p>
 *     <Dialog.Close />
 *   </Dialog.Panel>
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
