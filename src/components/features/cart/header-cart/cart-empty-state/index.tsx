"use client";

import { Button } from "@/components/ui/button";
import { useDialogContext } from "@/components/ui/dialog/dialog.context";
import { Text } from "@/components/ui/text";

/**
 * Empty cart state component displayed when the cart has no items.
 */
export function CartEmptyState() {
  const { onClose } = useDialogContext()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 text-center">
      <Text as="span" preset="body" className="grow flex flex-col font-semibold justify-center text-zinc-300">Your cart is empty</Text>
      <Button onClick={onClose}>
        Back to shop
      </Button>
    </div>
  )
}
