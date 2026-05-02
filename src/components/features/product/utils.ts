import type { ProductVariant } from '@/lib/integrations/shopify/types'

/**
 * Returns the cheapest available variant, preferring variants that are available
 * for sale. Falls back to all variants if none are available for sale.
 */
export function findCheapestVariant(variants: ProductVariant[]): ProductVariant | undefined {
  if (variants.length === 0) return undefined
  const pool = variants.filter(v => v.availableForSale)
  const source = pool.length > 0 ? pool : variants
  return source.reduce((cheapest, v) =>
    parseFloat(v.price.amount) < parseFloat(cheapest.price.amount) ? v : cheapest
  )
}
