import { shopifyFetch } from './client'
import { getPageQuery, getPagesQuery } from './queries/page'
import { removeEdgesAndNodes } from './reshaper'
import type { Page, ShopifyPageOperation, ShopifyPagesOperation } from './types'

/**
 * Fetches a single page by handle.
 *
 * @param handle - Page handle to fetch.
 * @returns The Page object.
 */
export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  })

  return res.body.data.pageByHandle
}

/**
 * Fetches all pages.
 *
 * @returns Array of Page objects.
 */
export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  })

  return removeEdgesAndNodes(res.body.data.pages)
}