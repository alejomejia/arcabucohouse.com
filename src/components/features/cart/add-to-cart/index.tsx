'use client'

import { useActionState } from 'react'

import { addItem } from '@/components/features/cart/server/actions'
import { useProduct } from '@/components/features/product/hooks/use-product'
import type { Product, ProductVariant } from '@/lib/integrations/shopify/types'

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
  const { state } = useProduct()
  const [message, formAction] = useActionState(addItem, null)

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()])
  )
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined
  const selectedVariantId = variant?.id || defaultVariantId
  const addItemAction = formAction.bind(null, selectedVariantId)
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId)

  return (
    <form
      action={async () => {
        if (finalVariant) {
          addCartItem(finalVariant, product)
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
