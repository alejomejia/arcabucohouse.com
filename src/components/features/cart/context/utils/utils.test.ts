import {
  createMockCartItem,
  createMockMoney,
  createMockProduct,
  createMockVariant,
} from '@/lib/integrations/shopify/test-helpers'

import {
  calculateItemCost,
  createEmptyCart,
  createOrUpdateCartItem,
  updateCartItem,
  updateCartTotals,
} from './'

// =============================================================================
// Test Suite
// =============================================================================

describe('calculateItemCost', () => {
  it('calculates cost correctly for positive quantities', () => {
    expect(calculateItemCost(3, '10.00')).toBe('30')
    expect(calculateItemCost(5, '25.50')).toBe('127.5')
    expect(calculateItemCost(1, '99.99')).toBe('99.99')
  })

  it('handles zero quantity', () => {
    expect(calculateItemCost(0, '10.00')).toBe('0')
  })

  it('handles decimal prices', () => {
    expect(calculateItemCost(2, '12.50')).toBe('25')
    expect(calculateItemCost(4, '7.25')).toBe('29')
  })

  it('handles large quantities', () => {
    expect(calculateItemCost(100, '1.00')).toBe('100')
    expect(calculateItemCost(1000, '0.50')).toBe('500')
  })
})

describe('updateCartItem', () => {
  describe('Delete operation', () => {
    it('returns null when updateType is delete', () => {
      const item = createMockCartItem({
        quantity: 5,
        cost: {
          totalAmount: createMockMoney({ amount: '50.00' }),
        },
      })

      const result = updateCartItem(item, 'delete')

      expect(result).toBeNull()
    })
  })

  describe('Increment operation (plus)', () => {
    it('increments quantity by 1', () => {
      const item = createMockCartItem({
        quantity: 2,
        cost: {
          totalAmount: createMockMoney({ amount: '20.00' }),
        },
      })

      const result = updateCartItem(item, 'plus')

      expect(result?.quantity).toBe(3)
    })

    it('updates total cost correctly when incrementing', () => {
      const item = createMockCartItem({
        quantity: 2,
        cost: {
          totalAmount: createMockMoney({ amount: '20.00' }),
        },
      })

      const result = updateCartItem(item, 'plus')

      expect(result?.cost.totalAmount.amount).toBe('30')
    })

    it('preserves currency code when incrementing', () => {
      const item = createMockCartItem({
        quantity: 1,
        cost: {
          totalAmount: createMockMoney({ amount: '10.00', currencyCode: 'EUR' }),
        },
      })

      const result = updateCartItem(item, 'plus')

      expect(result?.cost.totalAmount.currencyCode).toBe('EUR')
    })
  })

  describe('Decrement operation (minus)', () => {
    it('decrements quantity by 1', () => {
      const item = createMockCartItem({
        quantity: 5,
        cost: {
          totalAmount: createMockMoney({ amount: '50.00' }),
        },
      })

      const result = updateCartItem(item, 'minus')

      expect(result?.quantity).toBe(4)
    })

    it('updates total cost correctly when decrementing', () => {
      const item = createMockCartItem({
        quantity: 3,
        cost: {
          totalAmount: createMockMoney({ amount: '30.00' }),
        },
      })

      const result = updateCartItem(item, 'minus')

      expect(result?.cost.totalAmount.amount).toBe('20')
    })

    it('returns null when quantity reaches 0', () => {
      const item = createMockCartItem({
        quantity: 1,
        cost: {
          totalAmount: createMockMoney({ amount: '10.00' }),
        },
      })

      const result = updateCartItem(item, 'minus')

      expect(result).toBeNull()
    })
  })

  describe('Preserves item properties', () => {
    it('preserves all item properties except quantity and cost', () => {
      const item = createMockCartItem({
        id: 'item-123',
        quantity: 2,
        merchandise: {
          id: 'merch-456',
          title: 'Test Product',
          selectedOptions: [{ name: 'Size', value: 'M' }],
          product: {
            id: 'product-789',
            handle: 'test-product',
            title: 'Test Product',
            featuredImage: {
              url: 'https://example.com/image.jpg',
              altText: 'Test image',
            },
          },
        },
        cost: {
          totalAmount: createMockMoney({ amount: '20.00' }),
        },
      })

      const result = updateCartItem(item, 'plus')

      expect(result?.id).toBe('item-123')
      expect(result?.merchandise.id).toBe('merch-456')
      expect(result?.merchandise.title).toBe('Test Product')
      expect(result?.merchandise.selectedOptions).toEqual([
        { name: 'Size', value: 'M' },
      ])
    })
  })
})

describe('createOrUpdateCartItem', () => {
  describe('Creating new item', () => {
    it('creates new cart item with quantity 1 when item does not exist', () => {
      const variant = createMockVariant({
        id: 'variant-1',
        price: createMockMoney({ amount: '25.00' }),
      })
      const product = createMockProduct({ id: 'product-1' })

      const result = createOrUpdateCartItem(undefined, variant, product)

      expect(result.quantity).toBe(1)
      expect(result.cost.totalAmount.amount).toBe('25')
      expect(result.merchandise.id).toBe('variant-1')
    })

    it('sets correct merchandise properties from variant and product', () => {
      const variant = createMockVariant({
        id: 'variant-123',
        title: 'Variant Title',
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Blue' },
        ],
        price: createMockMoney({ amount: '30.00' }),
      })
      const product = createMockProduct({
        id: 'product-456',
        handle: 'test-handle',
        title: 'Product Title',
        images: [
          {
            url: 'https://example.com/img.jpg',
            altText: 'Product image',
            width: 100,
            height: 100,
          },
        ],
      })

      const result = createOrUpdateCartItem(undefined, variant, product)

      expect(result.merchandise.id).toBe('variant-123')
      expect(result.merchandise.title).toBe('Variant Title')
      expect(result.merchandise.selectedOptions).toEqual([
        { name: 'Size', value: 'L' },
        { name: 'Color', value: 'Blue' },
      ])
      expect(result.merchandise.product.id).toBe('product-456')
      expect(result.merchandise.product.handle).toBe('test-handle')
      expect(result.merchandise.product.title).toBe('Product Title')
    })

    it('preserves currency code from variant price', () => {
      const variant = createMockVariant({
        price: createMockMoney({ amount: '50.00', currencyCode: 'EUR' }),
      })
      const product = createMockProduct()

      const result = createOrUpdateCartItem(undefined, variant, product)

      expect(result.cost.totalAmount.currencyCode).toBe('EUR')
    })
  })

  describe('Updating existing item', () => {
    it('increments quantity when item already exists', () => {
      const existingItem = createMockCartItem({
        id: 'item-1',
        quantity: 3,
        merchandise: { id: 'variant-1' },
        cost: {
          totalAmount: createMockMoney({ amount: '75.00' }),
        },
      })
      const variant = createMockVariant({
        id: 'variant-1',
        price: createMockMoney({ amount: '25.00' }),
      })
      const product = createMockProduct()

      const result = createOrUpdateCartItem(existingItem, variant, product)

      expect(result.quantity).toBe(4)
      expect(result.cost.totalAmount.amount).toBe('100')
      expect(result.id).toBe('item-1')
    })

    it('preserves existing item ID when updating', () => {
      const existingItem = createMockCartItem({
        id: 'existing-item-id',
        quantity: 2,
        merchandise: { id: 'variant-1' },
        cost: {
          totalAmount: createMockMoney({ amount: '50.00' }),
        },
      })
      const variant = createMockVariant({
        id: 'variant-1',
        price: createMockMoney({ amount: '25.00' }),
      })
      const product = createMockProduct()

      const result = createOrUpdateCartItem(existingItem, variant, product)

      expect(result.id).toBe('existing-item-id')
    })
  })
})

describe('updateCartTotals', () => {
  it('calculates total quantity correctly', () => {
    const items = [
      createMockCartItem({ quantity: 2 }),
      createMockCartItem({ quantity: 3 }),
      createMockCartItem({ quantity: 1 }),
    ]

    const result = updateCartTotals(items)

    expect(result.totalQuantity).toBe(6)
  })

  it('calculates total amount correctly', () => {
    const items = [
      createMockCartItem({
        quantity: 2,
        cost: {
          totalAmount: createMockMoney({ amount: '20.00' }),
        },
      }),
      createMockCartItem({
        quantity: 1,
        cost: {
          totalAmount: createMockMoney({ amount: '15.00' }),
        },
      }),
    ]

    const result = updateCartTotals(items)

    expect(result.cost.totalAmount.amount).toBe('35')
  })

  it('uses currency code from first item', () => {
    const items = [
      createMockCartItem({
        cost: {
          totalAmount: createMockMoney({ amount: '10.00', currencyCode: 'EUR' }),
        },
      }),
      createMockCartItem({
        cost: {
          totalAmount: createMockMoney({ amount: '20.00', currencyCode: 'EUR' }),
        },
      }),
    ]

    const result = updateCartTotals(items)

    expect(result.cost.totalAmount.currencyCode).toBe('EUR')
    expect(result.cost.subtotalAmount.currencyCode).toBe('EUR')
    expect(result.cost.totalTaxAmount.currencyCode).toBe('EUR')
  })

  it('defaults to USD when items array is empty', () => {
    const result = updateCartTotals([])

    expect(result.cost.totalAmount.currencyCode).toBe('USD')
    expect(result.cost.subtotalAmount.currencyCode).toBe('USD')
    expect(result.cost.totalTaxAmount.currencyCode).toBe('USD')
  })

  it('sets subtotal equal to total amount', () => {
    const items = [
      createMockCartItem({
        cost: {
          totalAmount: createMockMoney({ amount: '25.00' }),
        },
      }),
    ]

    const result = updateCartTotals(items)

    expect(result.cost.subtotalAmount.amount).toBe('25')
    expect(result.cost.totalAmount.amount).toBe('25')
  })

  it('sets total tax amount to 0', () => {
    const items = [
      createMockCartItem({
        cost: {
          totalAmount: createMockMoney({ amount: '100.00' }),
        },
      }),
    ]

    const result = updateCartTotals(items)

    expect(result.cost.totalTaxAmount.amount).toBe('0')
  })

  it('handles empty items array', () => {
    const result = updateCartTotals([])

    expect(result.totalQuantity).toBe(0)
    expect(result.cost.totalAmount.amount).toBe('0')
    expect(result.cost.subtotalAmount.amount).toBe('0')
    expect(result.cost.totalTaxAmount.amount).toBe('0')
  })

  it('handles large quantities and amounts', () => {
    const items = [
      createMockCartItem({
        quantity: 100,
        cost: {
          totalAmount: createMockMoney({ amount: '1000.00' }),
        },
      }),
      createMockCartItem({
        quantity: 50,
        cost: {
          totalAmount: createMockMoney({ amount: '500.00' }),
        },
      }),
    ]

    const result = updateCartTotals(items)

    expect(result.totalQuantity).toBe(150)
    expect(result.cost.totalAmount.amount).toBe('1500')
  })
})

describe('createEmptyCart', () => {
  it('creates cart with default empty values', () => {
    const cart = createEmptyCart()

    expect(cart.id).toBeUndefined()
    expect(cart.checkoutUrl).toBe('')
    expect(cart.totalQuantity).toBe(0)
    expect(cart.lines).toEqual([])
    expect(cart.cost.subtotalAmount.amount).toBe('0')
    expect(cart.cost.totalAmount.amount).toBe('0')
    expect(cart.cost.totalTaxAmount.amount).toBe('0')
    expect(cart.cost.subtotalAmount.currencyCode).toBe('USD')
    expect(cart.cost.totalAmount.currencyCode).toBe('USD')
    expect(cart.cost.totalTaxAmount.currencyCode).toBe('USD')
  })
})
