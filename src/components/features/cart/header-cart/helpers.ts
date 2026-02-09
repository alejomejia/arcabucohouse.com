import { DEFAULT_OPTION } from '@/lib/integrations/constants'
import type { CartItem } from '@/lib/integrations/shopify/types'
import { createUrl } from '@/lib/integrations/utils'

type MerchandiseSearchParams = {
  [key: string]: string
}

/**
 * Creates a URL for a cart item's merchandise with selected options as search params.
 *
 * @param item - The cart item containing merchandise information
 * @returns The formatted URL string for the product with variant options
 */
export function createMerchandiseUrl(item: CartItem): string {
  const merchandiseSearchParams: MerchandiseSearchParams = {}

  item.merchandise.selectedOptions.forEach(({ name, value }) => {
    if (value !== DEFAULT_OPTION) {
      merchandiseSearchParams[name.toLowerCase()] = value
    }
  })

  return createUrl(
    `/product/${item.merchandise.product.handle}`,
    new URLSearchParams(merchandiseSearchParams)
  )
}
