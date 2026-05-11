import type { Metadata } from 'next'

import { HIDDEN_PRODUCT_TAG } from '@/lib/integrations/constants'
import { baseUrl } from '@/lib/integrations/utils'
import { config } from '@/lib/utils/config'

import type { Collection, Product } from '../integrations/shopify/types'

const siteName = config.siteName ?? 'Arcabuco'

// ---------------------------------------------------------------------------
// Product metadata & JSON-LD
// ---------------------------------------------------------------------------

/**
 * Generate metadata for a product page.
 * Title and description come from Shopify SEO fields (set in the Shopify admin)
 * with fallbacks to the product title/description.
 */
export function generateProductMetadata(product: Product): Metadata {
  const { url, width, height, altText: alt } = product.featuredImage || {}
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG)
  const title = product.seo.title || product.title
  const description = product.seo.description || product.description
  const canonicalUrl = `${baseUrl}/product/${product.handle}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName,
      ...(url && {
        images: [{ url, width, height, alt: alt ?? title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(url && { images: [url] }),
    },
  }
}

/**
 * Generate Schema.org Product JSON-LD for a product page.
 * Includes structured data for rich results (price, availability, brand).
 *
 * @see https://schema.org/Product
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */
export function generateProductJsonLd(product: Product) {
  const { title, description, featuredImage, availableForSale, priceRange, handle } = product

  // Use individual variant offers when available for richer structured data
  const variantOffers = product.variants.map((variant) => ({
    '@type': 'Offer',
    name: variant.title,
    price: variant.price.amount,
    priceCurrency: variant.price.currencyCode,
    availability: variant.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    url: `${baseUrl}/product/${handle}`,
    seller: {
      '@type': 'Organization',
      name: siteName,
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    url: `${baseUrl}/product/${handle}`,
    image: featuredImage?.url,
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    offers:
      variantOffers.length > 0
        ? variantOffers
        : {
            '@type': 'AggregateOffer',
            availability: availableForSale
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            priceCurrency: priceRange.minVariantPrice.currencyCode,
            highPrice: priceRange.maxVariantPrice.amount,
            lowPrice: priceRange.minVariantPrice.amount,
            offerCount: product.variants.length,
            seller: {
              '@type': 'Organization',
              name: siteName,
            },
          },
  }
}

// ---------------------------------------------------------------------------
// Category metadata & JSON-LD
// ---------------------------------------------------------------------------

/**
 * Generate metadata for a category (collection) page.
 * Title and description come from Shopify SEO fields.
 */
export function generateCategoryMetadata(category: Collection): Metadata {
  const title = category.seo.title || category.title
  const description = category.seo.description || category.description
  const canonicalUrl = `${baseUrl}/category/${category.handle.replace(/^category-/, '')}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/**
 * Generate Schema.org BreadcrumbList JSON-LD for a category page.
 * Helps search engines understand site hierarchy.
 *
 * @see https://schema.org/BreadcrumbList
 */
export function generateCategoryBreadcrumbJsonLd(category: Collection) {
  const handle = category.handle.replace(/^category-/, '')

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.seo.title || category.title,
        item: `${baseUrl}/category/${handle}`,
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// Product breadcrumb JSON-LD
// ---------------------------------------------------------------------------

/**
 * Generate Schema.org BreadcrumbList JSON-LD for a product page.
 * Uses the product's primary category if available.
 *
 * @see https://schema.org/BreadcrumbList
 */
export function generateProductBreadcrumbJsonLd(product: Product) {
  const items: { '@type': string; position: number; name: string; item: string }[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
  ]

  // Add category breadcrumb if the product belongs to a category- collection
  const categoryCollection = product.collections?.find((c) =>
    c.handle.startsWith('category-')
  )
  if (categoryCollection) {
    const catHandle = categoryCollection.handle.replace(/^category-/, '')
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: categoryCollection.title,
      item: `${baseUrl}/category/${catHandle}`,
    })
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: product.seo.title || product.title,
    item: `${baseUrl}/product/${product.handle}`,
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

// ---------------------------------------------------------------------------
// Global JSON-LD (rendered in root layout)
// ---------------------------------------------------------------------------

/**
 * Generate Schema.org Organization JSON-LD.
 * Helps search engines understand the business behind the site.
 *
 * TODO(seo): replace the placeholder `logo`, omitted `telephone`, and
 *   empty `sameAs` with confirmed business assets. Today's output will
 *   fail Google Rich Results validation for any business that ships a
 *   Logo schema — the linked /logo.png must exist and be ≥ 112×112.
 *
 * Required before launch:
 * - `/public/logo.png` (or move to `/images/logo.png` and update path).
 * - Customer-service phone number (uncomment + fill `telephone`).
 * - Social profile URLs (Instagram / Facebook / Pinterest etc.) in `sameAs`.
 *
 * @see https://schema.org/Organization
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: baseUrl,
    // TODO(seo): point at the real logo asset (≥ 112×112, prefer a 1:1 PNG).
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      // TODO(seo): set the real customer-service phone number.
      // telephone: '+57-XXX-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English'],
    },
    // TODO(seo): list verified social profile URLs.
    sameAs: [
      // 'https://www.instagram.com/arcabucohouse',
      // 'https://www.facebook.com/arcabucohouse',
    ],
  }
}

/**
 * Generate Schema.org WebSite JSON-LD with Sitelinks Search Box.
 * Enables a search box in Google results when someone searches for the brand.
 *
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 */
export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
