import { useEffect, useRef, useState } from 'react'

import { useCart } from '@/components/features/cart/hooks/use-cart'

/**
 * Hook to manage cart dialog open/close state and auto-open behavior.
 *
 * Tracks dialog visibility and automatically opens when items are added to cart.
 * Uses a ref to detect quantity changes and trigger auto-open only when quantity increases.
 *
 * @returns An object containing isOpen state and open/close handlers
 *
 * @example
 * ```tsx
 * function HeaderCart() {
 *   const { isOpen, openCart, closeCart } = useCartDialog()
 *   return (
 *     <>
 *       <CartTrigger onOpen={openCart} />
 *       <CartDialog isOpen={isOpen} onClose={closeCart} />
 *     </>
 *   )
 * }
 * ```
 */
export function useCartDialog() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const quantityRef = useRef(cart?.totalQuantity)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  // Auto-open cart when items are added
  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true)
      }
      quantityRef.current = cart?.totalQuantity
    }
  }, [isOpen, cart?.totalQuantity])

  return {
    isOpen,
    openCart,
    closeCart,
  }
}
