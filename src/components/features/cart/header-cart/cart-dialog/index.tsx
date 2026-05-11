'use client'

import { useCart } from '@/components/features/cart/hooks/use-cart'
import { redirectToCheckout } from '@/components/features/cart/server/actions'
import type { UpdateType } from '@/components/features/cart/types'
import { Dialog } from '@/components/ui/dialog'
import { cn } from '@/lib/utils/helpers'

import { CartEmptyState } from '../cart-empty-state'
import { CartItemsList } from '../cart-items-list'
import { CartSummary } from '../cart-summary'
import { CheckoutButton } from './checkout-button'

/**
 * Wrapper function for redirectToCheckout that matches the form action signature.
 * React form actions must return void | Promise<void>, but redirectToCheckout
 * can return a string error. This wrapper discards any return value.
 */
async function handleCheckout(_formData: FormData): Promise<void> {
  await redirectToCheckout()
}

type CartDialogProps = {
  isOpen: boolean
  onClose: () => void
  onUpdateItem: (merchandiseId: string, updateType: UpdateType) => void
}

/**
 * Cart dialog component that displays the shopping cart in a slide-out panel.
 * Handles empty state, items list, summary, and checkout.
 *
 * @param isOpen - Whether the dialog is open
 * @param onClose - Callback to close the dialog
 * @param onUpdateItem - Callback to update item quantity
 */
export function CartDialog({ isOpen, onClose, onUpdateItem }: CartDialogProps) {
  const { cart } = useCart()
  const isEmpty = !cart || cart.lines.length === 0

  return (
    <Dialog className="cart-dialog" isOpen={isOpen} onClose={onClose}>
      <Dialog.Overlay />
      <Dialog.Panel
        position="right"
        className={cn(
          'flex flex-col w-full h-full p-6 overflow-hidden',
          'text-zinc-50 md:w-140',
        )}
      >
        <div
          className={cn(
            'flex shrink-0 items-center justify-between',
            'border-b border-zinc-700 pb-4'
          )}
        >
          <Dialog.Title className="mt-1">Cart</Dialog.Title>
          <Dialog.Close aria-label="Close cart" />
        </div>

        {isEmpty ? (
          <CartEmptyState />
        ) : (
          <div className='flex min-h-0 flex-1 flex-col'>
            <CartItemsList
              items={cart.lines}
              onUpdateItem={onUpdateItem}
              onCloseCart={onClose}
            />
            <div className="shrink-0">
              <CartSummary cart={cart} />
              <form action={handleCheckout}>
                <CheckoutButton />
              </form>
            </div>
          </div>
        )}
      </Dialog.Panel>
    </Dialog>
  )
}
