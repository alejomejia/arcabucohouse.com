import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_STORE_CATEGORY_PATH
} from '@/lib/integrations/constants'

import type {
  Cart,
  Collection,
  Connection,
  Image,
  ShopifyCart,
  ShopifyCollection,
  ShopifyProduct
} from './types'

/**
 * Flattens a Shopify Image connection and ensures each image
 * has a fallback altText based on the product title and filename.
 *
 * @param images - Shopify GraphQL Image connection.
 * @param productTitle - Title of the product the images belong to.
 * @returns Array of normalized Image objects.
 */
const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images)

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1]
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    }
  })
}

/**
 * Removes `edges` and `node` wrappers from a Shopify GraphQL connection.
 *
 * @template T - Node type inside the connection.
 * @param array - Shopify GraphQL connection.
 * @returns Flattened array of nodes.
 */
export const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node)
}

/**
 * Normalizes a Shopify cart object.
 * Ensures totalTaxAmount exists and flattens cart lines.
 *
 * @param cart - Raw Shopify cart response.
 * @returns Normalized Cart object.
 */
export const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: cart.cost.totalAmount.currencyCode
    }
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  }
}

/**
 * Normalizes a Shopify collection and adds a local path.
 *
 * @param collection - Raw Shopify collection.
 * @returns Normalized Collection or undefined if invalid.
 */
export const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined
  }

  return {
    ...collection,
    path: `${SHOPIFY_STORE_CATEGORY_PATH}/${collection.handle}`
  }
}

/**
 * Normalizes an array of Shopify collections.
 *
 * @param collections - Array of raw Shopify collections.
 * @returns Array of normalized collections.
 */
export const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = []

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection)

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection)
      }
    }
  }

  return reshapedCollections
}

/**
 * Normalizes a Shopify product.
 * - Optionally filters hidden products.
 * - Flattens images, variants, and collections.
 *
 * @param product - Raw Shopify product.
 * @param filterHiddenProducts - Whether to exclude products tagged as hidden.
 * @returns Normalized product or undefined if filtered out.
 */
export const reshapeProduct = (
  product: ShopifyProduct, 
  filterHiddenProducts: boolean = true, 
  filterHiddenCollections: boolean = false
) => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined
  }

  const { images, variants, collections: rawCollections, ...rest } = product

  const collections = rawCollections ? reshapeCollections(removeEdgesAndNodes(rawCollections)) : []

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
    collections: filterHiddenCollections && collections.length > 0 ? 
      collections.filter((collection) => !collection.handle.startsWith('hidden')) : collections
  }
}

/**
 * Normalizes an array of Shopify products.
 *
 * @param products - Array of raw Shopify products.
 * @returns Array of normalized products.
 */
export const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = []

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product)

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct)
      }
    }
  }

  return reshapedProducts
}