import { HIDDEN_PRODUCT_TAG, SHOPIFY_STORE_CATEGORY_PATH } from '@/lib/integrations/constants'

import {
  removeEdgesAndNodes,
  reshapeCart,
  reshapeCollection,
  reshapeCollections,
  reshapeProduct,
  reshapeProducts,
} from './reshaper'
import { createMockImage, createMockMoney } from './test-helpers'
import type { Connection, Image, ShopifyCart, ShopifyCollection, ShopifyProduct } from './types'

// =============================================================================
// Helpers
// =============================================================================

/** Wraps a node list in the GraphQL `{ edges: [{ node }] }` envelope. */
function asConnection<T>(nodes: T[]): Connection<T> {
  return { edges: nodes.map((node) => ({ node })) }
}

function makeRawShopifyCollection(overrides?: Partial<ShopifyCollection>): ShopifyCollection {
  return {
    handle: 'category-rugs',
    title: 'Rugs',
    description: '',
    descriptionHtml: '',
    seo: { title: '', description: '' },
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  } as ShopifyCollection
}

function makeRawShopifyProduct(overrides?: Partial<ShopifyProduct>): ShopifyProduct {
  return {
    id: 'gid://shopify/Product/1',
    handle: 'my-product',
    availableForSale: true,
    title: 'My Product',
    description: 'desc',
    descriptionHtml: '<p>desc</p>',
    options: [],
    priceRange: {
      maxVariantPrice: createMockMoney({ amount: '100' }),
      minVariantPrice: createMockMoney({ amount: '50' }),
    },
    featuredImage: createMockImage(),
    images: asConnection<Image>([
      { url: 'https://cdn.shopify.com/files/main.jpg', altText: '', width: 100, height: 100 },
    ]),
    variants: asConnection([]),
    seo: { title: '', description: '' },
    tags: [],
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  } as ShopifyProduct
}

// =============================================================================
// removeEdgesAndNodes
// =============================================================================

describe('removeEdgesAndNodes', () => {
  it('flattens a GraphQL connection into an array of nodes', () => {
    const connection = asConnection([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
    expect(removeEdgesAndNodes(connection)).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
  })

  it('returns an empty array when edges is empty', () => {
    expect(removeEdgesAndNodes({ edges: [] })).toEqual([])
  })
})

// =============================================================================
// reshapeCart
// =============================================================================

describe('reshapeCart', () => {
  it('flattens cart lines from the connection envelope', () => {
    const cart = {
      cost: {
        totalAmount: createMockMoney({ amount: '50' }),
        subtotalAmount: createMockMoney({ amount: '50' }),
        totalTaxAmount: createMockMoney({ amount: '0' }),
      },
      lines: asConnection([{ id: 'line-1' }, { id: 'line-2' }]),
    } as unknown as ShopifyCart

    const reshaped = reshapeCart(cart)
    expect(reshaped.lines).toEqual([{ id: 'line-1' }, { id: 'line-2' }])
  })

  it('synthesizes a zero totalTaxAmount when Shopify omits it', () => {
    const cart = {
      cost: {
        totalAmount: createMockMoney({ amount: '50', currencyCode: 'USD' }),
        subtotalAmount: createMockMoney({ amount: '50' }),
      },
      lines: asConnection([]),
    } as unknown as ShopifyCart

    const reshaped = reshapeCart(cart)
    expect(reshaped.cost.totalTaxAmount).toEqual({ amount: '0.0', currencyCode: 'USD' })
  })
})

// =============================================================================
// reshapeCollection(s)
// =============================================================================

describe('reshapeCollection', () => {
  it('adds the storefront path derived from the collection handle', () => {
    const collection = makeRawShopifyCollection({ handle: 'category-rugs' })
    const reshaped = reshapeCollection(collection)
    expect(reshaped?.path).toBe(`${SHOPIFY_STORE_CATEGORY_PATH}/category-rugs`)
  })

  it('returns undefined when the input is nullish', () => {
    expect(reshapeCollection(null as unknown as ShopifyCollection)).toBeUndefined()
  })
})

describe('reshapeCollections', () => {
  it('reshapes every truthy collection and drops falsy entries', () => {
    const collections = [
      makeRawShopifyCollection({ handle: 'category-rugs' }),
      null as unknown as ShopifyCollection,
      makeRawShopifyCollection({ handle: 'category-lighting' }),
    ]
    const reshaped = reshapeCollections(collections)
    expect(reshaped).toHaveLength(2)
    expect(reshaped.map((c) => c.handle)).toEqual(['category-rugs', 'category-lighting'])
  })
})

// =============================================================================
// reshapeProduct(s)
// =============================================================================

describe('reshapeProduct', () => {
  it('filters out products tagged HIDDEN_PRODUCT_TAG by default', () => {
    const product = makeRawShopifyProduct({ tags: [HIDDEN_PRODUCT_TAG] })
    expect(reshapeProduct(product)).toBeUndefined()
  })

  it('keeps hidden products when filterHiddenProducts=false', () => {
    const product = makeRawShopifyProduct({ tags: [HIDDEN_PRODUCT_TAG] })
    expect(reshapeProduct(product, false)).toBeDefined()
  })

  it('synthesizes altText from product title + image filename when image has no alt', () => {
    const product = makeRawShopifyProduct({
      title: 'Linen Rug',
      images: asConnection<Image>([
        { url: 'https://cdn.shopify.com/files/linen-rug.jpg', altText: '', width: 100, height: 100 },
      ]),
    })
    const reshaped = reshapeProduct(product)
    expect(reshaped?.images[0]?.altText).toBe('Linen Rug - linen-rug')
  })

  it('picks the first `category-` collection as `category`', () => {
    const product = makeRawShopifyProduct({
      collections: asConnection([
        makeRawShopifyCollection({ handle: 'hidden-promos', title: 'Hidden' }),
        makeRawShopifyCollection({ handle: 'category-rugs', title: 'Rugs' }),
      ]),
    } as unknown as ShopifyProduct)
    const reshaped = reshapeProduct(product)
    expect(reshaped?.category?.handle).toBe('category-rugs')
  })

  it('filters hidden collections when filterHiddenCollections=true', () => {
    const product = makeRawShopifyProduct({
      collections: asConnection([
        makeRawShopifyCollection({ handle: 'hidden-promos' }),
        makeRawShopifyCollection({ handle: 'category-rugs' }),
      ]),
    } as unknown as ShopifyProduct)
    const reshaped = reshapeProduct(product, true, true)
    expect(reshaped?.collections.map((c) => c.handle)).toEqual(['category-rugs'])
  })

  it('returns empty downloads array when references is missing', () => {
    const product = makeRawShopifyProduct()
    const reshaped = reshapeProduct(product)
    expect(reshaped?.downloads).toEqual([])
  })
})

describe('reshapeProducts', () => {
  it('reshapes every visible product and drops hidden ones', () => {
    const products = [
      makeRawShopifyProduct({ handle: 'visible-a' }),
      makeRawShopifyProduct({ handle: 'hidden', tags: [HIDDEN_PRODUCT_TAG] }),
      makeRawShopifyProduct({ handle: 'visible-b' }),
    ]
    const reshaped = reshapeProducts(products)
    expect(reshaped.map((p) => p.handle)).toEqual(['visible-a', 'visible-b'])
  })
})
