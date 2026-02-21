import type { ProductOption, ProductVariant } from "@/lib/integrations/shopify/types"

/**
 * Checks if the product has no options or just one option.
 *
 * @param options - The product options.
 * @returns True if the product has no options or just one option, false otherwise.
 */
export function productHasNoOptionsOrJustOneOption(options: ProductOption[]) {
  return !options.length || (options.length === 1 && options[0]?.values.length === 1)
}

export type Combination = {
  id: string
  availableForSale: boolean
  [key: string]: string | boolean
}

/**
 * Gets the combinations of the product variants.
 *
 * @param variants - The product variants.
 * @returns The combinations of the product variants.
 */
export function getCombinations(variants: ProductVariant[]): Combination[] {
  return variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {}
    )
  }))
}