import { useEffect } from 'react'

import { useCart } from '@/components/features/cart/hooks/use-cart'
import { createCartAndSetCookie } from '@/components/features/cart/server/actions'

/**
 * Hook to ensure cart exists by creating it if missing.
 *
 * Checks if cart exists and automatically creates one if it doesn't.
 * This should be used once at the app level to ensure cart initialization.
 *
 * @example
 * ```tsx
 * function CartProviderWrapper({ children }) {
 *   useCartInit()
 *   return <>{children}</>
 * }
 * ```
 */
export function useCartInit() {
  const { cart } = useCart()

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie()
    }
  }, [cart])
}
