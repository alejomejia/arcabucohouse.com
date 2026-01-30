"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";

import { useCursor } from "@/components/effects/cursor/context";
import { CURSOR_MEDIUM } from "@/components/effects/cursor/cursor-states";
import { FOCUS_RING_ON_DARK_BG } from "@/lib/styles/const";
import { cn } from "@/lib/utils/helpers";

import type { UpdateType } from "../types";

type SubmitButtonProps = {
  type: Omit<UpdateType, "delete">;
};

/**
 * Submit button for cart quantity update forms with icon and loading state.
 *
 * Client Component - uses useFormStatus to track form submission state.
 * Renders PlusIcon for increment or MinusIcon for decrement operations.
 * Automatically disables during form submission to prevent duplicate requests.
 *
 * @param type - Update direction: "plus" to show plus icon, "minus" to show minus icon
 *
 * @example
 * ```tsx
 * <form action={updateAction}>
 *   <SubmitButton type="plus" />
 * </form>
 * ```
 */
export function SubmitButton({ type }: SubmitButtonProps) {
  const { setHover, setDefault } = useCursor()
  const { pending } = useFormStatus();

  const isPlus = type === "plus";
  const label = isPlus ? "Increase item quantity" : "Reduce item quantity";

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={label}
      className={cn(
        "flex-none flex items-center justify-center",
        "w-12 h-full p-3",
        "text-white hover:text-primary-400",
        "opacity-100 hover:bg-secondary-300 ",
        "ease transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-default",
        FOCUS_RING_ON_DARK_BG,
        {
          "ml-auto": !isPlus,
        }
      )}
      onMouseEnter={() => setHover(CURSOR_MEDIUM)}
      onMouseLeave={() => setDefault()}
    >
      {isPlus ? (
        <PlusIcon className="h-4 w-4" />
      ) : (
        <MinusIcon className="h-4 w-4" />
      )}
    </button>
  );
}