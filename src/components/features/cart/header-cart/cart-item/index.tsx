import { DeleteFromCartButton } from '@/components/features/cart/delete-from-cart-button'
import { EditItemQuantityButton } from '@/components/features/cart/edit-item-quantity-button'
import type { UpdateType } from '@/components/features/cart/types'
import { Image } from '@/components/ui/image'
import { Link } from '@/components/ui/link'
import { Price } from '@/components/ui/price'
import { DEFAULT_OPTION } from '@/lib/integrations/constants'
import type { CartItem } from '@/lib/integrations/shopify/types'

import { createMerchandiseUrl } from '../helpers'

type CartItemProps = {
  item: CartItem
  onUpdateItem: (
    merchandiseId: string,
    updateType: UpdateType
  ) => void
  onCloseCart: () => void
}

/**
 * Individual cart item component displaying product image, title, variant,
 * price, and quantity controls.
 *
 * @param item - The cart line item to display
 * @param onUpdateItem - Callback to update item quantity
 * @param onCloseCart - Callback to close the cart dialog
 */
export function CartItem({ item, onUpdateItem, onCloseCart }: CartItemProps) {
  const merchandiseUrl = createMerchandiseUrl(item)

  return (
    <li className="flex w-full flex-col border-b border-neutral-700">
      <div className="relative flex w-full flex-row justify-between px-1 py-4">
        <div className="absolute z-40 -ml-1 -mt-2">
          <DeleteFromCartButton
            item={item}
            optimisticUpdateAction={onUpdateItem}
          />
        </div>
        <div className="flex flex-row">
          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-700 bg-neutral-900 hover:bg-neutral-800">
            <Image
              className="h-full w-full object-cover"
              width={64}
              height={64}
              alt={
                item.merchandise.product.featuredImage.altText ||
                item.merchandise.product.title
              }
              src={item.merchandise.product.featuredImage.url}
            />
          </div>
          <Link
            href={merchandiseUrl}
            onClick={onCloseCart}
            className="z-30 ml-2 flex flex-row space-x-4"
          >
            <div className="flex flex-1 flex-col text-base">
              <span className="leading-tight">{item.merchandise.product.title}</span>
              {item.merchandise.title !== DEFAULT_OPTION ? (
                <p className="text-sm text-neutral-400">
                  {item.merchandise.title}
                </p>
              ) : null}
            </div>
          </Link>
        </div>
        <div className="flex h-16 flex-col justify-between">
          <Price
            className="flex justify-end space-y-2 text-right text-sm"
            amount={item.cost.totalAmount.amount}
            currencyCode={item.cost.totalAmount.currencyCode}
          />
          <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-700">
            <EditItemQuantityButton
              item={item}
              type="minus"
              optimisticUpdateAction={onUpdateItem}
            />
            <p className="w-6 text-center">
              <span className="w-full text-sm">{item.quantity}</span>
            </p>
            <EditItemQuantityButton
              item={item}
              type="plus"
              optimisticUpdateAction={onUpdateItem}
            />
          </div>
        </div>
      </div>
    </li>
  )
}
