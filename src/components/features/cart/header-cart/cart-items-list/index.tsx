import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

import type { UpdateType } from '@/components/features/cart/types'
import { useDialogContext } from '@/components/ui/dialog/context'
import { useElementHasScrollbar } from '@/lib/hooks/use-element-has-scrollbar'
import type { CartItem as CartItemType } from '@/lib/integrations/shopify/types'
import { cn } from '@/lib/utils/helpers'

import { CartItem } from '../cart-item'

type CartItemsListProps = {
  items: CartItemType[]
  onUpdateItem: (merchandiseId: string, updateType: UpdateType) => void
  onCloseCart: () => void
}

const STAGGER_DURATION = 1
const STAGGER_DELAY = 0.15

/**
 * List component that renders all cart items sorted alphabetically by product title.
 * List items use a staggered fade-in animation via GSAP, triggered when the dialog
 * has finished its open transition so the animation is visible.
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
  const { animationState } = useDialogContext()
  const { ref, hasScrollbar } = useElementHasScrollbar<HTMLUListElement>([
    items.length,
  ])

  useGSAP(
    () => {
      if (animationState === 'opening') {
        gsap.set('li', { opacity: 0.25 })
        gsap.to(
          'li',
          {
            opacity: 1,
            duration: STAGGER_DURATION,
            stagger: STAGGER_DELAY,
            delay: 0.35,
            ease: 'gentleSlow',
          }
        )
      }
    },
    { scope: ref, dependencies: [animationState, items.length] }
  )

  const sortedItems = [...items].sort((a, b) =>
    a.merchandise.product.title.localeCompare(b.merchandise.product.title)
  )

  return (
    <ul
      id="cart-dialog-list"
      ref={ref}
      className={cn(
        // Layout – grows to fill space, scrolls when content overflows
        'min-h-0 flex-1 overflow-auto overscroll-contain',
        {
          'pr-4': hasScrollbar
        }
      )}
    >
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
