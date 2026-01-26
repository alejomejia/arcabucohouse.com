import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";

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
export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-label="Remove cart item"
      disabled={pending}
      className="size-6 flex items-center justify-center rounded-full bg-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <XMarkIcon className="mx-px size-4 text-black" />
    </button>
  );
}