import type { MetadataRoute } from 'next'

import { baseUrl, isDevEnvironment } from '@/lib/integrations/utils'
import { getCollections } from '@/lib/integrations/shopify/collection'
import { getProducts } from '@/lib/integrations/shopify/product'

/**
 * Dynamic sitemap generated from Shopify data.
 *
 * Includes:
 *  - Static pages (home, search, legal)
 *  - All category pages (collections prefixed with "category-")
 *  - All published product pages
 *
 * Next.js automatically serves this at /sitemap.xml
 * Submit the URL to Google Search Console once the site is live.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isDevEnvironment) return []

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/returns-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  // Category pages (collections with handle prefix "category-")
  const collections = await getCollections()
  const categoryRoutes: MetadataRoute.Sitemap = collections
    .filter((c) => c.handle.startsWith('category-'))
    .map((c) => ({
      url: `${baseUrl}/category/${c.handle.replace(/^category-/, '')}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  // Product pages
  const products = await getProducts({})
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/product/${p.handle}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
