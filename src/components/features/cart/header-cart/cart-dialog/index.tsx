import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'

import { useCart } from '@/components/features/cart/hooks/use-cart'
import { redirectToCheckout } from '@/components/features/cart/server/actions'
import type { UpdateType } from '@/components/features/cart/types'

import { CartEmptyState } from '../cart-empty-state'
import { CartItemsList } from '../cart-items-list'
import { CartSummary } from '../cart-summary'
import { CheckoutButton } from './checkout-button'
import { CloseButton } from './close-button'

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
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-[.5px]"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="opacity-100 backdrop-blur-[.5px]"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
        </TransitionChild>
        <TransitionChild
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <DialogPanel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l p-6 backdrop-blur-xl md:w-[390px] border-neutral-700 bg-black/80 text-white">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">My Cart</p>
              <CloseButton onClick={onClose} />
            </div>

            {isEmpty ? (
              <CartEmptyState />
            ) : (
              <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                <CartItemsList
                  items={cart.lines}
                  onUpdateItem={onUpdateItem}
                  onCloseCart={onClose}
                />
                <CartSummary cart={cart} />
                <form action={handleCheckout}>
                  <CheckoutButton />
                </form>
              </div>
            )}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  )
}
