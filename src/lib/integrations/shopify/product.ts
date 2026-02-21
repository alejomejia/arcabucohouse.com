import { cacheLife, cacheTag } from 'next/cache'

import { TAGS } from '@/lib/integrations/constants'

import { shopifyFetch } from './client'
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product'
import { removeEdgesAndNodes, reshapeProduct, reshapeProducts } from './reshaper'
import type {
  Product,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation
} from './types'

/**
 * Fetches a single product by handle.
 * Applies caching and returns a normalized product.
 *
 * @param handle - Product handle to fetch.
 * @returns Normalized Product or undefined if not found.
 */
export async function getProduct(handle: string): Promise<Product | undefined> {
  'use cache'
  cacheTag(TAGS.products)
  cacheLife('shopify')

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle
    }
  })

  return reshapeProduct(res.body.data.product, false, true)
}

/**
 * Fetches product recommendations for a given product ID.
 * Applies caching and returns normalized products.
 *
 * @param productId - ID of the product to get recommendations for.
 * @returns Array of normalized recommended products.
 */
export async function getProductRecommendations(productId: string): Promise<Product[]> {
  'use cache'
  cacheTag(TAGS.products)
  cacheLife('shopify')

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId
    }
  })

  return reshapeProducts(res.body.data.productRecommendations)
}

/**
 * Fetches products optionally filtered by query and sorted.
 * Applies caching and returns normalized products.
 *
 * @param params.query - Optional search query string.
 * @param params.reverse - Whether to reverse the sort order.
 * @param params.sortKey - Shopify sort key.
 * @returns Array of normalized products.
 */
export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string
  reverse?: boolean
  sortKey?: string
}): Promise<Product[]> {
  'use cache'
  cacheTag(TAGS.products)
  cacheLife('shopify')

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey
    }
  })

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products))
}