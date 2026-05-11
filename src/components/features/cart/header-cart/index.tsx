'use client'

import { useEffect, useRef } from 'react'

import { useCart } from '@/components/features/cart/hooks/use-cart'
import { useCartInit } from '@/components/features/cart/hooks/use-cart-init'
import { trackCartOpen } from '@/lib/integrations/umami/events'

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

  const { cart, updateCartItem } = useCart()
  const { isOpen, openCart, closeCart } = useCartDialog()

  const wasOpenRef = useRef(false)
  const cartRef = useRef(cart)
  cartRef.current = cart

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      const snapshot = cartRef.current
      trackCartOpen({
        itemCount: snapshot?.totalQuantity ?? 0,
        cartTotal: snapshot?.cost.totalAmount.amount ?? '0',
        currency: snapshot?.cost.totalAmount.currencyCode ?? '',
      })
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

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
