import type { UpdateType } from '@/components/features/cart/types'
import type { CartItem as CartItemType } from '@/lib/integrations/shopify/types'

import { CartItem } from '../cart-item'

type CartItemsListProps = {
  items: CartItemType[]
  onUpdateItem: (merchandiseId: string, updateType: UpdateType) => void
  onCloseCart: () => void
}

/**
 * List component that renders all cart items sorted alphabetically by product title.
 *
 * @param items - Array of cart line items
 * @param onUpdateItem - Callback to update item quantity
 * @param onCloseCart - Callback to close the cart dialog
 */
export function CartItemsList({
  items,
  onUpdateItem,
  onCloseCart,
}: CartItemsListProps) {
  const sortedItems = [...items].sort((a, b) =>
    a.merchandise.product.title.localeCompare(b.merchandise.product.title)
  )

  return (
    <ul className="grow overflow-auto py-4">
      {sortedItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateItem={onUpdateItem}
          onCloseCart={onCloseCart}
        />
      ))}
    </ul>
  )
}
