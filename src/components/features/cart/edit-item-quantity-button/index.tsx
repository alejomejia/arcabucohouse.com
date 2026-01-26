"use client";

import { useActionState } from "react";

import { updateItemQuantity } from "@/components/features/cart/server/actions";
import type { CartItem } from "@/lib/integrations/shopify/types";

import type { UpdateTypeWithoutDelete } from "../types";
import { SubmitButton } from "./submit-button";

type EditItemQuantityButtonProps = {
  item: CartItem;
  type: UpdateTypeWithoutDelete;
  optimisticUpdateAction: (
    merchandiseId: string,
    updateType: UpdateTypeWithoutDelete
  ) => void;
};

/**
 * Button component that increments or decrements cart item quantity.
 *
 * Client Component - uses React hooks for form state management.
 * Performs optimistic updates for immediate UI feedback, then submits
 * server action to persist changes. Displays server response messages
 * via aria-live region for accessibility.
 *
 * @param item - Cart item to update (contains merchandise ID and current quantity)
 * @param type - Update direction: "plus" to increment, "minus" to decrement
 * @param optimisticUpdateAction - Function to update cart state optimistically before server confirmation
 *
 * @example
 * ```tsx
 * <EditItemQuantityButton
 *   item={cartItem}
 *   type="plus"
 *   optimisticUpdateAction={(id, type) => {
 *     dispatch({ type: "UPDATE_ITEM", payload: { merchandiseId: id, updateType: type } })
 *   }}
 * />
 * ```
 */
export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdateAction,
}: EditItemQuantityButtonProps) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdateAction(payload.merchandiseId, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} />
      <output aria-live="polite" className="sr-only">
        {message}
      </output>
    </form>
  );
}
