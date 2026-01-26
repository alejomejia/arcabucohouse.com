"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";

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
        "min-w-9 max-w-9 h-full p-2",
        "rounded-full hover:border-neutral-800 opacity-80 hover:opacity-100",
        "ease transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-default",
        {
          "ml-auto": !isPlus,
        }
      )}
    >
      {isPlus ? (
        <PlusIcon className="h-4 w-4 text-white" />
      ) : (
        <MinusIcon className="h-4 w-4 text-white" />
      )}
    </button>
  );
}