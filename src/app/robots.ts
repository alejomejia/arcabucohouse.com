import type { MetadataRoute } from 'next'

import { baseUrl, isDevEnvironment } from '@/lib/integrations/utils'

/**
 * robots.txt generation.
 *
 * Rules:
 *  - On dev environments (dev.arcabucohouse.com, localhost): block all crawlers.
 *  - On production: allow crawlers to index the public storefront and disallow internal paths.
 *  - Reference the sitemap for efficient crawling.
 *
 * Next.js automatically serves this at /robots.txt
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  if (isDevEnvironment) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/cart', '/checkout', '/account', '/orders'],
      },
      // Allow AI crawlers to access product and category pages
      // so LLM-powered assistants can surface your products
      {
        userAgent: 'GPTBot',
        allow: ['/product/', '/category/', '/search'],
        disallow: ['/api/', '/cart', '/checkout', '/account'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/product/', '/category/', '/search'],
        disallow: ['/api/', '/cart', '/checkout', '/account'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/product/', '/category/', '/search'],
        disallow: ['/api/', '/cart', '/checkout', '/account'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/product/', '/category/', '/search'],
        disallow: ['/api/', '/cart', '/checkout', '/account'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/cart', '/checkout', '/account'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
