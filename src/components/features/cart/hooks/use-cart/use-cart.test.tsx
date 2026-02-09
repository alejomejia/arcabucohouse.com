import { act, renderHook, waitFor } from '@testing-library/react'
import { Suspense, type ReactNode } from 'react'

import { CartContext } from '@/components/features/cart/context'
import { createMockCartItem, createMockMoney } from '@/lib/integrations/shopify/test-helpers'
import type { Cart } from '@/lib/integrations/shopify/types'

import { useCart } from './'

// =============================================================================
// Test Helpers
// =============================================================================

function createMockCart(overrides?: {
  lines?: ReturnType<typeof createMockCartItem>[]
  totalQuantity?: number
}): Cart {
  return {
    id: 'cart-1',
    checkoutUrl: '/checkout',
    totalQuantity: overrides?.totalQuantity ?? 0,
    lines: overrides?.lines ?? [],
    cost: {
      subtotalAmount: createMockMoney({ amount: '0' }),
      totalAmount: createMockMoney({ amount: '0' }),
      totalTaxAmount: createMockMoney({ amount: '0' }),
    },
  }
}

function createMockCartPromise(cart: Cart | undefined): Promise<Cart | undefined> {
  return Promise.resolve(cart)
}

function createWrapper(cartPromise: Promise<Cart | undefined>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <CartContext.Provider value={{ cartPromise }}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </CartContext.Provider>
    )
  }
}

async function renderHookWithSuspense<TResult, TProps = unknown>(
  hook: (props?: TProps) => TResult,
  options?: Parameters<typeof renderHook<TResult, TProps>>[1]
) {
  let hookResult!: ReturnType<typeof renderHook<TResult, TProps>>

  await act(async () => {
    hookResult = renderHook(hook, options)
  })

  await waitFor(() => {
    expect(hookResult.result.current).not.toBeNull()
  })

  return hookResult
}

// =============================================================================
// Test Suite
// =============================================================================

describe('useCart', () => {
  describe('Context integration', () => {
    it('throws error when used outside CartProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

      expect(() => {
        renderHook(() => useCart())
      }).toThrow('useCart must be used within a CartProvider')

      consoleSpy.mockRestore()
    })

    it('returns cart from context when provider exists', async () => {
      const mockCart = createMockCart({
        lines: [createMockCartItem()],
        totalQuantity: 1,
      })
      const cartPromise = createMockCartPromise(mockCart)
      const wrapper = createWrapper(cartPromise)

      const { result } = await renderHookWithSuspense(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.cart).toBeDefined()
      })

      expect(result.current.cart).toEqual(mockCart)
    })

    it('handles undefined cart from promise', async () => {
      const cartPromise = createMockCartPromise(undefined)
      const wrapper = createWrapper(cartPromise)

      const { result } = await renderHookWithSuspense(() => useCart(), { wrapper })

      expect(result.current.cart).toBeUndefined()
      expect(typeof result.current.updateCartItem).toBe('function')
      expect(typeof result.current.addCartItem).toBe('function')
    })
  })

  describe('Memoization', () => {
    it('returns stable references across rerenders', async () => {
      const mockCart = createMockCart({ lines: [], totalQuantity: 0 })
      const cartPromise = createMockCartPromise(mockCart)
      const wrapper = createWrapper(cartPromise)

      const { result, rerender } = await renderHookWithSuspense(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.cart).toBeDefined()
      })

      const firstResult = result.current
      const firstUpdateCartItem = result.current.updateCartItem
      const firstAddCartItem = result.current.addCartItem

      rerender()

      expect(result.current).toBe(firstResult)
      expect(result.current.updateCartItem).toBe(firstUpdateCartItem)
      expect(result.current.addCartItem).toBe(firstAddCartItem)
    })
  })
})
