'use client'

import type { ProductVariant } from '@/lib/integrations/shopify/types'

import { useProduct } from './use-product'

/**
 * Returns the variant that matches the current option selections in ProductContext,
 * or the only variant for single-variant products.
 */
export function useSelectedVariant(variants: ProductVariant[]): ProductVariant | undefined {
  const { state } = useProduct()

  const matched = variants.find(v =>
    v.selectedOptions.every(option => option.value === state[option.name.toLowerCase()])
  )

  const defaultVariant = variants.length === 1 ? variants[0] : undefined
  return matched ?? defaultVariant
}
