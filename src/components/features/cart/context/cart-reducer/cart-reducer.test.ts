import type { CartAction } from '@/components/features/cart/types'
import {
  createMockCartItem,
  createMockMoney,
  createMockProduct,
  createMockVariant,
} from '@/lib/integrations/shopify/test-helpers'

import { cartReducer } from './'

// =============================================================================
// Test Helpers
// =============================================================================

function createMockCart(overrides?: {
  lines?: ReturnType<typeof createMockCartItem>[]
  totalQuantity?: number
  cost?: { totalAmount: ReturnType<typeof createMockMoney> }
}) {
  return {
    id: 'cart-1',
    checkoutUrl: '/checkout',
    totalQuantity: overrides?.totalQuantity ?? 0,
    lines: overrides?.lines ?? [],
    cost: {
      subtotalAmount: createMockMoney({ amount: '0' }),
      totalAmount: overrides?.cost?.totalAmount ?? createMockMoney({ amount: '0' }),
      totalTaxAmount: createMockMoney({ amount: '0' }),
    },
  }
}

// =============================================================================
// Test Suite
// =============================================================================

describe('cartReducer', () => {
  describe('Initial state', () => {
    it('creates empty cart when state is undefined', () => {
      const action: CartAction = {
        type: 'UPDATE_ITEM',
        payload: { merchandiseId: 'non-existent', updateType: 'plus' },
      }

      const result = cartReducer(undefined, action)

      expect(result).toMatchObject({
        totalQuantity: 0,
        lines: [],
        cost: {
          totalAmount: { amount: '0' },
        },
      })
    })
  })

  describe('UPDATE_ITEM action', () => {
    describe('Increment quantity (plus)', () => {
      it('increments item quantity by 1', () => {
        const item = createMockCartItem({
          id: 'item-1',
          quantity: 2,
          merchandise: { id: 'merch-1' },
          cost: {
            totalAmount: createMockMoney({ amount: '20.00' }),
          },
        })
        const cart = createMockCart({ lines: [item] })
        const action: CartAction = {
          type: 'UPDATE_ITEM',
          payload: { merchandiseId: 'merch-1', updateType: 'plus' },
        }

        const result = cartReducer(cart, action)

        expect(result.lines[0]?.quantity).toBe(3)
        expect(result.totalQuantity).toBe(3)
      })

      it('updates total cost when quantity increases', () => {
        const item = createMockCartItem({
          id: 'item-1',
          quantity: 1,
          merchandise: { id: 'merch-1' },
          cost: {
            totalAmount: createMockMoney({ amount: '10.00' }),
          },
        })
        const cart = createMockCart({ lines: [item] })
        const action: CartAction = {
          type: 'UPDATE_ITEM',
          payload: { merchandiseId: 'merch-1', updateType: 'plus' },
        }

        const result = cartReducer(cart, action)

        expect(result.lines[0]?.cost.totalAmount.amount).toBe('20')
        expect(result.cost.totalAmount.amount).toBe('20')
      })

      it('does not affect other items in cart', () => {
        const item1 = createMockCartItem({
          id: 'item-1',
          quantity: 2,
          merchandise: { id: 'merch-1' },
          cost: {
            totalAmount: createMockMoney({ amount: '20.00' }),
          },
        })
        const item2 = createMockCartItem({
          id: 'item-2',
          quantity: 1,
          merchandise: { id: 'merch-2' },
          cost: {
            totalAmount: createMockMoney({ amount: '15.00' }),
          },
        })
        const cart = createMockCart({ lines: [item1, item2] })
        const action: CartAction = {
          type: 'UPDATE_ITEM',
          payload: { merchandiseId: 'merch-1', updateType: 'plus' },
        }

        const result = cartReducer(cart, action)

        expect(result.lines[0]?.quantity).toBe(3)
        expect(result.lines[1]?.quantity).toBe(1)
        expect(result.totalQuantity).toBe(4)
      })
    })

    describe('Decrement quantity (minus)', () => {
      it('decrements item quantity by 1', () => {
        const item = createMockCartItem({
          id: 'item-1',
          quantity: 3,
          merchandise: { id: 'merch-1' },
          cost: {
            totalAmount: createMockMoney({ amount: '30.00' }),
          },
        })
        const cart = createMockCart({ lines: [item] })
        const action: CartAction = {
          type: 'UPDATE_ITEM',
          payload: { merchandiseId: 'merch-1', updateType: 'minus' },
        }

        const result = cartReducer(cart, action)

        expect(result.lines[0]?.quantity).toBe(2)
        expect(result.totalQuantity).toBe(2)
      })

      it('updates total cost when quantity decreases', () => {
        const item = createMockCartItem({
          id: 'item-1',
          quantity: 3,
          merchandise: { id: 'merch-1' },
          cost: {
            totalAmount: createMockMoney({ amount: '30.00' }),
          },
        })
        const cart = createMockCart({ lines: [item] })
        const action: CartAction = {
          type: 'UPDATE_ITEM',
          payload: { merchandiseId: 'merch-1', updateType: 'minus' },
        }

        const result = cartReducer(cart, action)

        expect(result.lines[0]?.cost.totalAmount.amount).toBe('20')
        expect(result.cost.totalAmount.amount).toBe('20')
      })

      it('removes item when quantity reaches 0', () => {
        const item = createMockCartItem({
          id: 'item-1',
          quantity: 1,
          merchandise: { id: 'merch-1' },
          cost: {
            totalAmount: createMockMoney({ amount: '10.00' }),
          },
        })
        const cart = createMockCart({ lines: [item] })
        const action: CartAction = {
          type: 'UPDATE_ITEM',
          payload: { merchandiseId: 'merch-1', updateType: 'minus' },
        }

        const result = cartReducer(cart, action)

        expect(result.lines).toHaveLength(0)
        expect(result.totalQuantity).toBe(0)
        expect(result.cost.totalAmount.amount).toBe('0')
      })
    })

    describe('Delete item', () => {
      it('removes item from cart', () => {
        const item1 = createMockCartItem({
          id: 'item-1',
          quantity: 2,
          merchandise: { id: 'merch-1' },
        })
        const item2 = createMockCartItem({
          id: 'item-2',
          quantity: 1,
          merchandise: { id: 'merch-2' },
        })
        const cart = createMockCart({ lines: [item1, item2] })
        const action: CartAction = {
          type: 'UPDATE_ITEM',
          payload: { merchandiseId: 'merch-1', updateType: 'delete' },
        }

        const result = cartReducer(cart, action)

        expect(result.lines).toHaveLength(1)
        expect(result.lines[0]?.merchandise.id).toBe('merch-2')
        expect(result.totalQuantity).toBe(1)
      })

      it('returns empty cart when last item is deleted', () => {
        const item = createMockCartItem({
          id: 'item-1',
          quantity: 1,
          merchandise: { id: 'merch-1' },
          cost: {
            totalAmount: createMockMoney({ amount: '10.00' }),
          },
        })
        const cart = createMockCart({ lines: [item] })
        const action: CartAction = {
          type: 'UPDATE_ITEM',
          payload: { merchandiseId: 'merch-1', updateType: 'delete' },
        }

        const result = cartReducer(cart, action)

        expect(result.lines).toHaveLength(0)
        expect(result.totalQuantity).toBe(0)
        expect(result.cost.totalAmount.amount).toBe('0')
      })
    })

    describe('Non-existent item', () => {
      it('does not modify cart when merchandiseId does not exist', () => {
        const item = createMockCartItem({
          id: 'item-1',
          quantity: 2,
          merchandise: { id: 'merch-1' },
        })
        const cart = createMockCart({ lines: [item] })
        const action: CartAction = {
          type: 'UPDATE_ITEM',
          payload: { merchandiseId: 'non-existent', updateType: 'plus' },
        }

        const result = cartReducer(cart, action)

        expect(result.lines).toHaveLength(1)
        expect(result.lines[0]?.quantity).toBe(2)
        expect(result.totalQuantity).toBe(2)
      })
    })
  })

  describe('ADD_ITEM action', () => {
    it('adds new item to empty cart', () => {
      const cart = createMockCart()
      const variant = createMockVariant({
        id: 'variant-1',
        price: createMockMoney({ amount: '25.00' }),
      })
      const product = createMockProduct({ id: 'product-1' })
      const action: CartAction = {
        type: 'ADD_ITEM',
        payload: { variant, product },
      }

      const result = cartReducer(cart, action)

      expect(result.lines).toHaveLength(1)
      expect(result.lines[0]?.quantity).toBe(1)
      expect(result.lines[0]?.merchandise.id).toBe('variant-1')
      expect(result.totalQuantity).toBe(1)
      expect(result.cost.totalAmount.amount).toBe('25')
    })

    it('adds new item to cart with existing items', () => {
      const existingItem = createMockCartItem({
        id: 'item-1',
        quantity: 2,
        merchandise: { id: 'merch-1' },
        cost: {
          totalAmount: createMockMoney({ amount: '20.00' }),
        },
      })
      const cart = createMockCart({ lines: [existingItem] })
      const variant = createMockVariant({
        id: 'variant-2',
        price: createMockMoney({ amount: '15.00' }),
      })
      const product = createMockProduct({ id: 'product-2' })
      const action: CartAction = {
        type: 'ADD_ITEM',
        payload: { variant, product },
      }

      const result = cartReducer(cart, action)

      expect(result.lines).toHaveLength(2)
      expect(result.totalQuantity).toBe(3)
      expect(result.cost.totalAmount.amount).toBe('35')
    })

    it('increments quantity when item already exists in cart', () => {
      const existingItem = createMockCartItem({
        id: 'item-1',
        quantity: 2,
        merchandise: { id: 'variant-1' },
        cost: {
          totalAmount: createMockMoney({ amount: '50.00' }),
        },
      })
      const cart = createMockCart({ lines: [existingItem] })
      const variant = createMockVariant({
        id: 'variant-1',
        price: createMockMoney({ amount: '25.00' }),
      })
      const product = createMockProduct({ id: 'product-1' })
      const action: CartAction = {
        type: 'ADD_ITEM',
        payload: { variant, product },
      }

      const result = cartReducer(cart, action)

      expect(result.lines).toHaveLength(1)
      expect(result.lines[0]?.quantity).toBe(3)
      expect(result.totalQuantity).toBe(3)
      expect(result.cost.totalAmount.amount).toBe('75')
    })

    it('updates totals correctly when adding multiple items', () => {
      const cart = createMockCart()
      const variant1 = createMockVariant({
        id: 'variant-1',
        price: createMockMoney({ amount: '10.00' }),
      })
      const variant2 = createMockVariant({
        id: 'variant-2',
        price: createMockMoney({ amount: '20.00' }),
      })
      const product1 = createMockProduct({ id: 'product-1' })
      const product2 = createMockProduct({ id: 'product-2' })

      let result = cartReducer(cart, {
        type: 'ADD_ITEM',
        payload: { variant: variant1, product: product1 },
      })
      result = cartReducer(result, {
        type: 'ADD_ITEM',
        payload: { variant: variant2, product: product2 },
      })

      expect(result.lines).toHaveLength(2)
      expect(result.totalQuantity).toBe(2)
      expect(result.cost.totalAmount.amount).toBe('30')
    })
  })

  describe('Default case', () => {
    it('returns current cart for unknown action types', () => {
      const cart = createMockCart({
        lines: [createMockCartItem()],
        totalQuantity: 1,
      })
      const action = {
        type: 'UNKNOWN_ACTION',
        payload: {},
      } as unknown as CartAction

      const result = cartReducer(cart, action)

      expect(result).toEqual(cart)
    })
  })

  describe('Edge cases', () => {
    it('handles cart with multiple items correctly', () => {
      const item1 = createMockCartItem({
        id: 'item-1',
        quantity: 2,
        merchandise: { id: 'merch-1' },
        cost: {
          totalAmount: createMockMoney({ amount: '20.00' }),
        },
      })
      const item2 = createMockCartItem({
        id: 'item-2',
        quantity: 3,
        merchandise: { id: 'merch-2' },
        cost: {
          totalAmount: createMockMoney({ amount: '45.00' }),
        },
      })
      const cart = createMockCart({ lines: [item1, item2] })

      const result = cartReducer(cart, {
        type: 'UPDATE_ITEM',
        payload: { merchandiseId: 'merch-1', updateType: 'plus' },
      })

      expect(result.totalQuantity).toBe(6)
      expect(result.cost.totalAmount.amount).toBe('75')
    })

    it('maintains cart metadata when updating items', () => {
      const cart = createMockCart({
        lines: [createMockCartItem({ merchandise: { id: 'merch-1' } })],
      })
      cart.id = 'cart-123'
      cart.checkoutUrl = '/checkout/123'

      const result = cartReducer(cart, {
        type: 'UPDATE_ITEM',
        payload: { merchandiseId: 'merch-1', updateType: 'plus' },
      })

      expect(result.id).toBe('cart-123')
      expect(result.checkoutUrl).toBe('/checkout/123')
    })
  })
})
