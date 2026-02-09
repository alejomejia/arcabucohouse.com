'use client'

import { useCart } from '@/components/features/cart/hooks/use-cart'
import { useCartInit } from '@/components/features/cart/hooks/use-cart-init'

import { CartDialog } from './cart-dialog'
import { CartTrigger } from './cart-trigger'
import { useCartDialog } from './hooks/use-cart-dialog'

/**
 * Header cart component that orchestrates the cart trigger button and dialog.
 * Handles cart state management, animations, and user interactions.
 *
 * Client Component - ensures cart is initialized and manages cart dialog state.
 * Automatically creates cart if it doesn't exist on mount.
 */
export function HeaderCart() {
  useCartInit()

  const { updateCartItem } = useCart()
  const { isOpen, openCart, closeCart } = useCartDialog()

  return (
    <>
      <CartTrigger onOpen={openCart} />
      <CartDialog
        isOpen={isOpen}
        onClose={closeCart}
        onUpdateItem={updateCartItem}
      />
    </>
  )
}
