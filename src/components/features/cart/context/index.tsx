"use client";

import { type ReactNode, createContext, useMemo } from "react";

import type { Cart } from "@/lib/integrations/shopify/types";

import type { CartContextType } from "../types";

export const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
  cartPromise: Promise<Cart | undefined>;
}

/**
 * Provider component that wraps the application and provides cart context.
 *
 * @param children - React children components
 * @param cartPromise - Promise that resolves to the cart data
 */
export function CartProvider({
  children,
  cartPromise,
}: CartProviderProps) {
  const value = useMemo(() => ({ cartPromise }), [cartPromise]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}


