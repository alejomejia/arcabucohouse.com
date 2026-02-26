import type { Metadata } from 'next'

import { HIDDEN_PRODUCT_TAG } from '@/lib/integrations/constants'

import type { Collection, Product } from '../integrations/shopify/types'

/**
 * Generate metadata for a product
 * @param product - The product to generate metadata for
 * @returns The metadata for the product
 */
export function generateProductMetadata(product: Product): Metadata {
  const { url, width, height, altText: alt } = product.featuredImage || {}
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG)

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
        images: [
          {
            url,
            width,
            height,
            alt
          }
        ]
      }
      : null
  }
}

/**
 * Generate JSON-LD for a product
 * @param product - The product to generate JSON-LD for
 * @returns The JSON-LD for the product
 */
export function generateProductJsonLd(product: Product) {
  const { title, description, featuredImage, availableForSale, priceRange } = product

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description,
    image: featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceCurrency: priceRange.minVariantPrice.currencyCode,
      highPrice: priceRange.maxVariantPrice.amount,
      lowPrice: priceRange.minVariantPrice.amount
    }
  }
}

/**
 * Generate metadata for a category
 * @param category - The collection category to generate metadata for
 * @returns The metadata for the category
 */
export function generateCategoryMetadata(category: Collection): Metadata {
  return {
    title: category.seo.title || category.title,
    description: category.seo.description || category.description,
  }
}