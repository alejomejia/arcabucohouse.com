import { useDialogContext } from "@/components/ui/dialog/context";
import { FOCUS_RING_ON_DARK_BG } from "@/lib/styles/const";
import { cn } from "@/lib/utils/helpers";

/**
 * Empty cart state component displayed when the cart has no items.
 */
export function CartEmptyState() {
  const { onClose } = useDialogContext()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <p className="grow flex flex-col justify-center text-center text-lg font-semibold text-secondary-100 font-serif self">[ Your cart is empty ]</p>
      <button
        type="button"
        className={cn(
          "block w-full px-4 py-5",
          "text-center text-base uppercase font-semibold tracking-wider text-white",
          "bg-secondary-400 opacity-90 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-opacity duration-300 ease-in-out",
          FOCUS_RING_ON_DARK_BG
        )}
        onClick={onClose}
      >
        Back to shop
      </button>
    </div>
  )
}
