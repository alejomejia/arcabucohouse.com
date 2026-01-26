"use client";

import { useActionState } from "react";

import { removeItem } from "@/components/features/cart/server/actions";
import type { CartItem } from "@/lib/integrations/shopify/types";

import type { UpdateType } from "../types";
import { SubmitButton } from "./submit-button";

type DeleteFromCartButtonProps = {
  item: CartItem;
  optimisticUpdateAction: (merchandiseId: string, updateType: UpdateType) => void;
}

export function DeleteFromCartButton({
  item,
  optimisticUpdateAction,
}: DeleteFromCartButtonProps) {
  const [message, formAction] = useActionState(removeItem, null);

  const merchandiseId = item.merchandise.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdateAction(merchandiseId, "delete");
        removeItemAction();
      }}
    >
      <SubmitButton />
      <output aria-live="polite" className="sr-only">
        {message}
      </output>
    </form>
  );
}
