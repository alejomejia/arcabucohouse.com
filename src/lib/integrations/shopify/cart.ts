import { cookies } from 'next/headers'

import { shopifyFetch } from './client'
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart'
import { getCartQuery } from './queries/cart'
import { reshapeCart } from './reshaper'
import type {
  Cart,
  ShopifyAddToCartOperation,
  ShopifyCartOperation,
  ShopifyCreateCartOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from './types'

/**
 * Creates a new Shopify cart.
 *
 * @returns A normalized Cart object.
 */
export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation
  })

  return reshapeCart(res.body.data.cartCreate.cart)
}

/**
 * Adds one or more merchandise lines to the current cart.
 *
 * @param lines - Array of cart lines with merchandiseId and quantity.
 * @returns Updated normalized Cart object.
 */
export async function addToCart(lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    }
  })
  return reshapeCart(res.body.data.cartLinesAdd.cart)
}

/**
 * Removes one or more line items from the current cart.
 *
 * @param lineIds - Array of cart line item IDs to remove.
 * @returns Updated normalized Cart object.
 */
export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    }
  })

  return reshapeCart(res.body.data.cartLinesRemove.cart)
}

/**
 * Updates quantities or merchandise for existing cart lines.
 *
 * @param lines - Array of cart lines with id, merchandiseId, and quantity.
 * @returns Updated normalized Cart object.
 */
export async function updateCart(lines: { id: string; merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
  })

  return reshapeCart(res.body.data.cartLinesUpdate.cart)
}

/**
 * Retrieves the current cart using the cartId stored in cookies.
 *
 * @returns Normalized Cart object or undefined if no cart exists.
 */
export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value

  if (!cartId) {
    return undefined
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId }
  })

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined
  }

  return reshapeCart(res.body.data.cart)
}