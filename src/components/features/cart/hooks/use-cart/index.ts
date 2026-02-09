import {
  startTransition,
  use,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
} from "react";

import { CartContext } from "@/components/features/cart/context";
import { cartReducer } from "@/components/features/cart/context/cart-reducer";
import type { UpdateType } from "@/components/features/cart/types";
import type { Product, ProductVariant } from "@/lib/integrations/shopify/types";

/**
 * Hook to access and manipulate the cart state.
 *
 * Provides optimistic cart updates that reflect immediately in the UI.
 * Updates are wrapped in `startTransition` to comply with React 19's
 * requirement that optimistic updates occur within transitions.
 *
 * @returns An object containing the cart, updateCartItem, and addCartItem functions
 * @throws Error if used outside of CartProvider
 *
 * @example
 * ```tsx
 * function CartButton() {
 *   const { cart, updateCartItem, addCartItem } = useCart()
 *
 *   const handleIncrement = (id: string) => {
 *     updateCartItem(id, 'plus')
 *   }
 *
 *   return <button onClick={() => handleIncrement('item-1')}>+</button>
 * }
 * ```
 */
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const initialCart = use(context.cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer,
  );

  const updateCartItem = useCallback(
    (merchandiseId: string, updateType: UpdateType) => {
      startTransition(() => {
        updateOptimisticCart({
          type: "UPDATE_ITEM",
          payload: { merchandiseId, updateType },
        });
      });
    },
    [updateOptimisticCart],
  );

  const addCartItem = useCallback(
    (variant: ProductVariant, product: Product) => {
      startTransition(() => {
        updateOptimisticCart({ type: "ADD_ITEM", payload: { variant, product } });
      });
    },
    [updateOptimisticCart],
  );

  return useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
    }),
    [optimisticCart, updateCartItem, addCartItem],
  );
}