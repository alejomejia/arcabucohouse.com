import { cacheLife, cacheTag } from 'next/cache'

import { domain, TAGS } from '@/lib/integrations/constants'
import { isDev } from '@/lib/utils/config'

import { getMenuQuery } from './queries/menu'
import type { Menu, ShopifyMenuOperation } from './types'

import { shopifyFetch } from './client'

/**
 * Fetches a menu by handle and normalizes its items.
 * Applies caching. Returns an empty array on error.
 *
 * @param handle - Menu handle to fetch.
 * @returns Array of normalized menu items with title and path.
 */
export async function getMenu(handle: string): Promise<Menu[]> {
  'use cache'
  cacheTag(TAGS.collections)
  cacheLife('shopify')

  try {
    const res = await shopifyFetch<ShopifyMenuOperation>({
      query: getMenuQuery,
      variables: {
        handle
      }
    })

    return (
      res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
        title: item.title,
        path: item.url.replace(domain, '').replace('/collections', '/search').replace('/pages', '')
      })) || []
    )
  } catch (error) {
    // Log error in development but don't fail the build
    if (isDev) {
      console.error(`Failed to fetch menu with handle "${handle}":`, error)
    }

    return []
  }
}