'use client'

import { useActionState, useMemo } from 'react'

import { addItem } from '@/components/features/cart/server/actions'
import { useSelectedVariant } from '@/components/features/product/hooks/use-selected-variant'
import type { Product, ProductVariant } from '@/lib/integrations/shopify/types'
import { trackCartAdd } from '@/lib/integrations/umami/events'

import { useCart } from '../hooks/use-cart'
import { SubmitButton } from './submit-button'

type AddToCartProps = {
  /** Product to add to cart with all variants and availability information */
  product: Product
}

/**
 * Form component for adding products to cart with variant selection and optimistic updates.
 *
 * Client Component - requires ProductProvider context to access selected variant options.
 * Automatically selects the variant for single-variant products. For multi-variant products,
 * requires user to select options via ProductContext before enabling the submit button.
 *
 * Performs optimistic cart updates before server action completes. Displays form submission
 * status via aria-live region for screen readers.
 *
 * @param product - Product object containing variants, availability, and product metadata
 *
 * @example
 * ```tsx
 * // Must be wrapped in ProductProvider
 * <ProductProvider>
 *   <AddToCart product={product} />
 * </ProductProvider>
 * ```
 */
export function AddToCart({ product }: AddToCartProps) {
  const { variants, availableForSale } = product

  const { addCartItem } = useCart()
  const selectedVariant = useSelectedVariant(variants)
  const selectedVariantId = selectedVariant?.id

  const trackedAddItem = useMemo(() => withCartAddTracking(product, selectedVariant), [product, selectedVariant])
  const [message, formAction] = useActionState(trackedAddItem, null)
  const addItemAction = formAction.bind(null, selectedVariantId)

  return (
    <form
      action={async () => {
        if (selectedVariant) {
          addCartItem(selectedVariant, product)
          addItemAction()
        }
      }}
    >
      <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />
      <output aria-live="polite" className="sr-only">
        {message}
      </output>
    </form>
  )
}

/**
 * Wraps `addItem` so a `cart_add` event fires only when the server action
 * resolves without returning an error string.
 */
function withCartAddTracking(product: Product, selectedVariant: ProductVariant | undefined) {
  return async function addItemTracked(prevState: unknown, variantId: string | undefined) {
    const result = await addItem(prevState, variantId)

    if (!result && selectedVariant) {
      trackCartAdd({
        handle: product.handle,
        title: product.title,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        price: selectedVariant.price.amount,
        currency: selectedVariant.price.currencyCode,
        quantity: 1,
      })
    }

    return result
  }
}
