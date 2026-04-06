import { cacheLife, cacheTag } from 'next/cache'

import { domain, TAGS } from '@/lib/integrations/constants'
import { isDev } from '@/lib/utils/config'

import { shopifyFetch } from './client'
import { getMenuQuery } from './queries/menu'
import type { Menu, ShopifyMenuOperation } from './types'

/**
 * Default path transformation for menu items:
 * - Strip the shop domain
 * - Map `/collections` to `/search`
 * - Strip `/pages`
 */
function defaultMenuPath(url: string): string {
  return url
    .replace(domain, '')
    .replace('/pages', '')
}

/**
 * Menu-specific path transformation chosen by URL content.
 * - Category collection URLs (/collections/category-*) → /category/slug
 * - All other URLs → defaultMenuPath
 */
function resolveMenuPath(url: string): string {
  if (url.includes('/collections/category-')) {
    return url
      .replace(domain, '')
      .replace('category-', '')
      .replace('/collections', '/category')
  }

  return defaultMenuPath(url)
}

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
        path: resolveMenuPath(item.url)
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