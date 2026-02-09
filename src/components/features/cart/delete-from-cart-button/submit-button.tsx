import { XMarkIcon } from "@heroicons/react/24/outline";
import { type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { useCursor } from "@/components/effects/cursor/context";
import { CURSOR_MEDIUM } from "@/components/effects/cursor/cursor-states";
import { FOCUS_RING_ON_DARK_BG } from "@/lib/styles/const";
import { cn } from "@/lib/utils/helpers";

type SubmitButtonProps = {
  children?: ReactNode
}

/**
 * Submit button for removing items from cart with loading state.
 *
 * Client Component - uses useFormStatus to track form submission state.
 * Displays XMarkIcon and automatically disables during form submission
 * to prevent duplicate requests. Must be used within a form element.
 *
 * @example
 * ```tsx
 * <form action={removeItemAction}>
 *   <SubmitButton />
 * </form>
 * ```
 */
export function SubmitButton({ children }: SubmitButtonProps) {
  const { setHover, setDefault } = useCursor()
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-label="Remove cart item"
      disabled={pending}
      className={cn(
        "flex items-center justify-center",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        FOCUS_RING_ON_DARK_BG,
        {
          "size-6 rounded-full bg-secondary-200": !children,
        }
      )}
      onMouseEnter={() => setHover(CURSOR_MEDIUM)}
      onMouseLeave={() => setDefault()}
    >
      {children ?? <XMarkIcon className="mx-px size-4 text-black" />}
    </button>
  );
}