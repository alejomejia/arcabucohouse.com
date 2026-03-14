import { cacheLife, cacheTag } from 'next/cache'

import { TAGS } from '@/lib/integrations/constants'

import { shopifyFetch } from './client'
import {
  getCategoryQuery,
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection'
import {
  removeEdgesAndNodes,
  reshapeCollection,
  reshapeCollections,
  reshapeProducts
} from './reshaper'
import type {
  Category,
  Collection,
  Product,
  ShopifyCategoryOperation,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation
} from './types'

/**
 * Fetches a single collection by handle.
 * Applies caching and returns a normalized collection.
 *
 * @param handle - Collection handle.
 * @returns Normalized Collection or undefined if not found.
 */
export async function getCollection(handle: string): Promise<Collection | undefined> {
  'use cache'
  cacheTag(TAGS.collections)
  cacheLife('shopify')

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle
    }
  })

  return reshapeCollection(res.body.data.collection)
}

/**
 * Fetches products belonging to a specific collection.
 * Applies caching and optional sorting.
 *
 * @param params.collection - Collection handle.
 * @param params.reverse - Whether to reverse the sort order.
 * @param params.sortKey - Shopify sort key.
 * @returns Array of normalized products.
 */
export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string
  reverse?: boolean
  sortKey?: string
}): Promise<Product[]> {
  'use cache'
  cacheTag(TAGS.collections, TAGS.products)
  cacheLife('shopify')

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  })

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``)
    return []
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products))
}

/**
 * Fetches all collections.
 * Adds a synthetic "All" collection and filters hidden ones.
 *
 * @returns Array of normalized collections.
 */
export async function getCollections(): Promise<Collection[]> {
  'use cache'
  cacheTag(TAGS.collections)
  cacheLife('shopify')

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery
  })
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections)
  const collections = [
    {
      id: 'all',
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter((collection) => !collection.handle.startsWith('hidden'))
  ]

  return collections
}

/**
 * Fetches single category collection and it's data.
 * Applies caching and optional sorting.
 *
 * @param params.collection - Collection handle.
 * @param params.reverse - Whether to reverse the sort order.
 * @param params.sortKey - Shopify sort key.
 * @returns Array of normalized products.
 */
export async function getCategory({
  collection,
  reverse,
  sortKey
}: {
  collection: string
  reverse?: boolean
  sortKey?: string
}): Promise<Category | undefined> {
  'use cache'
  cacheTag(TAGS.collections, TAGS.products)
  cacheLife('shopify')

  const res = await shopifyFetch<ShopifyCategoryOperation>({
    query: getCategoryQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  })

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``)
    return undefined
  }

  return {
    ...res.body.data.collection,
    products: reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products)),
  }
}